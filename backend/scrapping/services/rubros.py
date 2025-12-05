from bs4 import BeautifulSoup
from pathlib import Path

CATEGORIAS_TARGET = {
    "NOTEBOOKS": ["NOTEBOOK", "LAPTOP", "PORTATIL"],
    "COMPUTADORAS": ["COMPUTADORA", "PC", "DESKTOP", "ALL IN ONE", "MINI PC", "CPU", "WORKSTATION"],
    "MONITORES": ["MONITOR", "PANTALLA"],
    "IMPRESORAS": ["IMP ", "IMPRESORA", "MULTIFUNCION", "SIST. CONT.", "INKJET", "LASER"]
}

EXCLUSIONES = [
    "ACCESORIO", "CABLE", "FUNDA", "MOCHILA", "BOLSO", "MALETIN", 
    "SOPORTE", "ADAPTADOR", "LIMPIEZA", "FICHA", "CONECTOR", "PLACA",
    "CARTUCHO", "TONER", "TINTA", "CINTA", "RESMA", "PAPEL", "ROLLO", 
    "INSUMO", "AGUJA", "DRUM", "FOTOGRAFICO", "RIBBON", "MATRICIAL", 
    "TERMICA", "CASETE", "CASETES", " P/", "PARA ", "REPUESTO" 
]

def parsear_rubros_desde_html(ruta_archivo: Path) -> dict[str, list[str]]:
    if not ruta_archivo.exists():
        print(f"[ERROR] No se encontró: {ruta_archivo}")
        return {}

    contenido = ruta_archivo.read_text(encoding="utf-8", errors="ignore")
    soup = BeautifulSoup(contenido, "html.parser")
    labels = soup.find_all("label", class_="_rubro")
    
    resultado = {k: [] for k in CATEGORIAS_TARGET.keys()}
    
    for lbl in labels:
        rubro_id = lbl.get("id")
        texto_full = lbl.get_text(strip=True).upper() 
        
        if not rubro_id or rubro_id == "0":
            continue

        if any(bad_word in texto_full for bad_word in EXCLUSIONES):
            continue

        for cat_maestra, keywords in CATEGORIAS_TARGET.items():
            if any(kw in texto_full for kw in keywords):
                resultado[cat_maestra].append(rubro_id)
                break 
    
    return resultado