import requests
import json
import os
import concurrent.futures
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

URL_LISTADO = os.getenv("URL_LISTADO")
MAX_WORKERS = 5 

PRODUCT_EXCLUSIONS = [
    "CABLE", "ADAPTADOR", "CONECTOR", "FICHA", "SOPORTE", "MOCHILA", "FUNDA", "MALETIN",
    "TONER", "CARTUCHO", "TINTA", "CINTA", "RESMA", "ROLLO", "RIBBON",
    "MOUSE", "TECLADO", "AURICULAR", "PARLANTE", "WEBCAM", "JOYSTICK",
    "GABINETE", "FUENTE", "COOLER", "FAN", "WATERCOOLER", "WATER", "HEATSINK", "DISIPADOR",
    "MOTHERBOARD", "PLACA", "VIDEO", "MEMORIA", "DISCO", "PROCESSOR", "PROCESADOR",
    "VIDEOWALL", "PANTALLA INTERACTIVA", "LFD", "SIGNAGE", "JUEGO", "GIFT", "OFFICE", "WINDOWS",
    "SERVICE", "GARANTIA", "CAREPACK", "LICENCIA", "SOFTWARE"
]

def _fetch_rubro_safe(args) -> List[Dict[str, Any]]:
    categoria, rubro_id = args
    payload = {
        "rubro": rubro_id,
        "orden": "DA",
        "stock": "T", 
        "limit": 500
    }
    
    items_limpios = []
    
    try:
        resp = requests.post(URL_LISTADO, json=payload, timeout=20)
        resp.raise_for_status()
        raw_text = resp.content.decode("utf-8-sig")
        data = json.loads(raw_text)
        
        if isinstance(data, list):
            for item in data:
                sku = item.get("codiart")
                nombre = item.get("descart", "").strip().upper()
                
                if not sku: continue
                if any(bad in nombre for bad in PRODUCT_EXCLUSIONS): continue
                if categoria == "NOTEBOOKS" and not ("NB" in nombre or "NOTEBOOK" in nombre or "LAPTOP" in nombre):
                    pass 

                item["_categoria_target"] = categoria
                items_limpios.append(item)
                
    except Exception as e:
        print(f"   [ERR] Falló rubro {rubro_id}: {e}")
        return []
    
    return items_limpios

def obtener_todos_los_productos(rubros_map: Dict[str, List[str]]) -> List[Dict[str, Any]]:
    productos_totales = []
    vistos_skus = set()
    
    tareas = []
    for categoria, ids in rubros_map.items():
        for rid in ids:
            tareas.append((categoria, rid))

    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        resultados = executor.map(_fetch_rubro_safe, tareas)
        
        for lista_productos in resultados:
            for p in lista_productos:
                sku = p.get("codiart")
                if sku not in vistos_skus:
                    vistos_skus.add(sku)
                    productos_totales.append(p)

    print(f"--- Total productos base LIMPIOS: {len(productos_totales)} ---")
    return productos_totales