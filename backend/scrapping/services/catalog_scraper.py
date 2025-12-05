import re
import sys
import concurrent.futures
from typing import List, Dict, Any
from .client import obtener_html_meta
from parsers.meta_parser import parsear_meta, PLACEHOLDERS

MAX_WORKERS_META = 20

SCHEMA_ATRIBUTOS = {
    "NOTEBOOKS": ["cpu", "ram", "almacenamiento", "pulgadas", "so", "gpu"],
    "COMPUTADORAS": ["cpu", "ram", "almacenamiento", "so", "gpu"],
    "MONITORES": ["pulgadas", "resolucion", "tasa_refresco", "tipo_panel"],
    "IMPRESORAS": ["tipo", "velocidad", "conectividad", "formato_maximo", "sistema_continuo"]
}

def _detectar_categoria(nombre_rubro: str) -> str:
    r = nombre_rubro.upper()
    if "NOTEBOOK" in r or "PORTATIL" in r: return "NOTEBOOKS"
    if "MONITOR" in r or "PANTALLA" in r: return "MONITORES"
    if "IMP" in r or "MULTIFUNCION" in r: return "IMPRESORAS"
    if any(x in r for x in ["PC", "COMPU", "DESKTOP", "AIO", "ALL IN ONE"]): return "COMPUTADORAS"
    return "OTROS"

def _limpiar_marca(marca_raw: str) -> str:
    if not marca_raw: return "GENERICO"
    m = marca_raw.upper().strip()
    for marca in ["DELL", "ASUS", "HP", "LENOVO", "BROTHER", "EPSON", "CX", 
                  "SAMSUNG", "LG", "PHILIPS", "GIGABYTE", "MSI", "HIKVISION", "PERFORMANCE", "CANON", "SONY", "LEXMARK"]:
        if marca in m: return marca
    return marca_raw.title()

def _limpiar_nombre_display(nombre_raw: str, categoria: str) -> str:
    nombre = nombre_raw.strip()
    prefixes = [r'^NB\s+', r'^MFL?C?\s+', r'^IMP\s+', r'^LN\s+', r'^LC\s+', r'^AIO\s+']
    for p in prefixes:
        nombre = re.sub(p, '', nombre, flags=re.IGNORECASE)
    nombre = re.sub(r'\s*\([A-Z0-9\s\+\-]{1,5}\)$', '', nombre)
    nombre = re.sub(r'\s*\([A-Z]{2,4}$', '', nombre)
    return nombre.replace("  ", " ").strip()

def _validar_y_completar_atributos(attrs: dict, categoria: str) -> dict | None:
    if not attrs: return None
    campos_esperados = SCHEMA_ATRIBUTOS.get(categoria, [])
    
    if categoria in ["NOTEBOOKS", "COMPUTADORAS"]:
        if not attrs.get("cpu") or not attrs.get("ram"): return None
    if categoria == "MONITORES":
        if not attrs.get("pulgadas"): return None
    if categoria == "IMPRESORAS":
        if not attrs.get("tipo"): return None

    attrs_finales = {}
    for campo in campos_esperados:
        attrs_finales[campo] = attrs.get(campo, None)
    return attrs_finales

def _procesar_producto_worker(p: Dict[str, Any]) -> Dict[str, Any] | None:
    sku = p.get("codiart")
    nombre_original = p.get("descart", "")
    rubro_nombre = p.get("rubro", {}).get("name", "") if isinstance(p.get("rubro"), dict) else ""
    marca_raw = p.get("grupo", {}).get("name", "") if isinstance(p.get("grupo"), dict) else ""
    
    categoria = p.get("_categoria_target") or _detectar_categoria(rubro_nombre)
    
    img = PLACEHOLDERS.get(categoria, PLACEHOLDERS["DEFAULT"])
    galeria = []
    atributos_raw = {}

    html_meta = obtener_html_meta(sku) if sku else None

    if html_meta:
        try:
            meta = parsear_meta(html_meta, categoria, titulo_producto=nombre_original, rubro_nombre=rubro_nombre)
            img = meta.get("img", img)
            galeria = meta.get("galeria", galeria)
            atributos_raw = meta.get("atributos", atributos_raw) or {}
        except Exception:
            pass
    
    atributos_limpios = _validar_y_completar_atributos(atributos_raw, categoria)
    if atributos_limpios is None: return None

    return {
        "sku": sku,
        "nombre": _limpiar_nombre_display(nombre_original, categoria),
        "marca": _limpiar_marca(marca_raw),
        "precio_usd": p.get("precio", {}).get("lista", 0),
        "stock": True,
        "categoria": categoria,
        "img": img,
        "galeria": galeria,
        "atributos": atributos_limpios
    }

def generar_catalogo_desde_lista(productos_base: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    catalogo = []
    total = len(productos_base)
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS_META) as executor:
        future_to_sku = {executor.submit(_procesar_producto_worker, p): p['codiart'] for p in productos_base}
        
        completados = 0
        descartados = 0
        
        for future in concurrent.futures.as_completed(future_to_sku):
            completados += 1
            try:
                item = future.result()
                if item:
                    catalogo.append(item)
                else:
                    descartados += 1
                
                percent = int((completados / total) * 100)
                bar_len = 30
                filled_len = int(bar_len * completados // total)
                bar = '█' * filled_len + '-' * (bar_len - filled_len)
                
                sys.stdout.write(f'\rProgreso: [{bar}] {percent}% ({completados}/{total}) - Descartados: {descartados}')
                sys.stdout.flush()
                
            except Exception:
                pass

    return catalogo