import re
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import os

load_dotenv()

BASE_IMG_URL = os.getenv("BASE_IMG_URL")
ND_FILENAME = "nd.png"

PLACEHOLDERS = {
    "NOTEBOOKS": "https://d2t1xqejof9utc.cloudfront.net/screenshots/pics/23a70a7b019b584ae08b402b5dd4ab2d/large.png",
    "COMPUTADORAS": "https://cdn-icons-png.freepik.com/512/2330/2330501.png",
    "MONITORES": "https://www.freepik.com/free-photos-vectors/generic-monitor",
    "IMPRESORAS": "https://cdn-icons-png.freepik.com/512/5404/5404037.png",
    "DEFAULT": "https://pngimg.com/d/question_mark_PNG99.png"
}

def _limpiar_valor(valor: str) -> str:
    if not valor: return ""
    return valor.strip().strip('"').strip("'").strip()

def _normalizar_img_src(src: str) -> str:
    if not src: return ""
    src = src.strip()
    if src.startswith("http"): return src
    marker = "/imgart/"
    filename = src.split(marker)[-1] if marker in src else src.split("/")[-1]
    return BASE_IMG_URL + filename

def _deduplicar_imgs(rutas: list[str]) -> list[str]:
    vistas, vistos = [], set()
    for raw in rutas:
        url = _normalizar_img_src(raw)
        if not url or ND_FILENAME in url.lower(): continue
        if url not in vistos:
            vistos.add(url)
            vistas.append(url)
    return vistas

def _normalizar_almacenamiento(texto: str) -> str:
    if not texto: return ""
    t = texto.upper()
    
    m_tb = re.search(r'(?<!\d)(\d+)\s*(T|TB)', t)
    if m_tb: return f"{m_tb.group(1)} TB SSD"

    m_gb = re.search(r'(?<!\d)(\d+)\s*(G|GB)', t)
    if m_gb: return f"{m_gb.group(1)} GB SSD"
    
    m_ssd_pre = re.search(r'SSD\s*(\d{3,4})', t) 
    if m_ssd_pre: return f"{m_ssd_pre.group(1)} GB SSD"
    
    m_ssd_post = re.search(r'(\d{3,4})\s*SSD', t)
    if m_ssd_post: return f"{m_ssd_post.group(1)} GB SSD"

    return _limpiar_valor(texto)

def _normalizar_cpu(texto: str) -> str:
    if not texto: return ""
    t = texto.upper()
    basura = [
        "INTEL", "AMD", "PROCESSOR", "PROCESADOR", "CPU", "MICRO", "SOC",
        "®", "™", "CORE", "RYZEN", "GENERACIÓN", "GENERACION", "GEN", 
        "NÚCLEOS", "NUCLEOS", "CORES", "CACHE", "UP TO", "HASTA", "VPRO", 
        "NPU", "TOPS", "AI", "EDITION"
    ]
    for b in basura: t = t.replace(b, "")
    t = re.sub(r'\d+\.?\d*\s*GHZ', '', t)
    
    # Intel
    if m := re.search(r'ULTRA\s*(\d)\s*(\d{3}[A-Z]*)', t): return f"Intel Core Ultra {m.group(1)} {m.group(2)}"
    if m := re.search(r'\b(\d)\s+(\d{3}[UHK])', t): return f"Intel Core {m.group(1)} {m.group(2)}"
    if m := re.search(r'I(\d)[- ]?([N]?\d{3,5}[A-Z]*)', t): return f"Intel Core i{m.group(1)}-{m.group(2)}"
    
    # AMD
    if m := re.search(r'(\d)\s*(\d{4}[A-Z]*)', t): return f"AMD Ryzen {m.group(1)} {m.group(2)}"
    if m := re.search(r'ATHLON\s*(\d{3,4}[A-Z]*)', t): return f"AMD Athlon {m.group(1)}"

    # Low End
    if "CELERON" in texto.upper():
        m = re.search(r'([NJG]\d{4})', t)
        return f"Intel Celeron {m.group(1) if m else ''}".strip()
    if "PENTIUM" in texto.upper():
        m = re.search(r'([NJG]\d{4}|GOLD|SILVER)', t)
        return f"Intel Pentium {m.group(1) if m else ''}".strip()

    return re.sub(r'\s+', ' ', t).strip()

def _normalizar_so(texto: str) -> str:
    if not texto: return None
    t = texto.upper()
    t = t.replace("COMPATIBLE CON", "").replace("SISTEMA OPERATIVO", "").strip()
    
    if "W11P" in t or "PRO" in t: return "Windows 11 Pro"
    if "W11H" in t or "HOME" in t: return "Windows 11 Home"
    if "NO" in t or "FREE" in t or "S/S" in t: return "FreeDOS"
    return t.strip().title()

def _validar_gpu(texto: str) -> str | None:
    if not texto: return None
    t = texto.upper()
    bad = ["HDMI", "VGA", "USB", "DPORT", "DISPLAY", "RJ45", "AUDIO", "NO POSEE", "INTEGRADA"]
    if any(k in t for k in bad): return None
    return _limpiar_valor(texto)

def _extraer_desde_titulo(titulo: str, categoria: str) -> dict:
    attrs = {}
    txt = titulo.upper().replace("  ", " ")

    ram_match = re.search(r'(?<!\d)(\d{1,3})\s*(G|GB)(?!\w|BITS)', txt)
    if ram_match:
        val = int(ram_match.group(1))
        if 4 <= val <= 128: attrs["ram"] = f"{val} GB"

    storage_str = None
    
    if m := re.search(r'(?<!\d)(\d+)\s*(T|TB)', txt):
        storage_str = f"{m.group(1)} TB SSD"
    
    elif m := re.search(r'(?<!\d)(\d{3,4})\s*(G|GB)', txt):
        val = int(m.group(1))
        if val >= 120: 
            storage_str = f"{val} GB SSD"
            
    elif m := re.search(r'SSD\s*(\d{3,4})|(\d{3,4})\s*SSD', txt):
        val = m.group(1) or m.group(2)
        storage_str = f"{val} GB SSD"

    if storage_str:
        attrs["almacenamiento"] = storage_str

    if "ULTRA" in txt or re.search(r'U[579]', txt):
        if m := re.search(r'(?:ULTRA|U)([579])[- ]?(\d{3}[A-Z]*)', txt): attrs["cpu"] = f"Intel Core Ultra {m.group(1)} {m.group(2)}"
    elif re.search(r'(?:CORE|C)([357])[- ]?(\d{3}[A-Z]*)', txt):
        if m := re.search(r'(?:CORE|C)([357])[- ]?(\d{3}[A-Z]*)', txt): attrs["cpu"] = f"Intel Core {m.group(1)} {m.group(2)}"
    elif re.search(r'I([3579])[- ]?([N]?\d{3,5}[A-Z]*)', txt):
        if m := re.search(r'I([3579])[- ]?([N]?\d{3,5}[A-Z]*)', txt): attrs["cpu"] = f"Intel Core i{m.group(1)}-{m.group(2)}"
    elif re.search(r'R([3579])[- ]?(\d{4}[A-Z]*)', txt):
        if m := re.search(r'R([3579])[- ]?(\d{4}[A-Z]*)', txt): attrs["cpu"] = f"AMD Ryzen {m.group(1)} {m.group(2)}"
    elif "RYZEN" in txt:
        if m := re.search(r'RYZEN\s*(\d)\s*(\d{4}[A-Z]*)?', txt): attrs["cpu"] = f"AMD Ryzen {m.group(1)} {m.group(2) or ''}".strip()
    elif "CELERON" in txt:
        if m := re.search(r'CELERON\s*([NJG]\d{4})', txt): attrs["cpu"] = f"Intel Celeron {m.group(1)}"
    elif "PENTIUM" in txt:
        if m := re.search(r'PENTIUM\s*([NJG]\d{4})', txt): attrs["cpu"] = f"Intel Pentium {m.group(1)}"

    if "W11P" in txt or "PRO" in txt: attrs["so"] = "Windows 11 Pro"
    elif "W11H" in txt or "HOME" in txt: attrs["so"] = "Windows 11 Home"
    elif "NO OS" in txt or "FREE" in txt or "S/S" in txt: attrs["so"] = "FreeDOS"

    if categoria == "MONITORES":
        if m := re.search(r'(?<!\d)(19|2[247]|32|34)\s*("|PULG)?', txt): attrs["pulgadas"] = m.group(1)
        if m := re.search(r'(\d{2,3})\s*HZ', txt): attrs["tasa_refresco"] = f"{m.group(1)} Hz"
        
        if "FHD" in txt or "1080" in txt: attrs["resolucion"] = "FHD (1920x1080)"
        elif "QHD" in txt or "2K" in txt or "1440" in txt: attrs["resolucion"] = "2K QHD (2560x1440)"
        elif "UHD" in txt or "4K" in txt or "2160" in txt: attrs["resolucion"] = "4K UHD (3840x2160)"
        
        if "IPS" in txt: attrs["tipo_panel"] = "IPS"
        if "VA" in txt: attrs["tipo_panel"] = "VA"

    if categoria == "IMPRESORAS":
        if m := re.search(r'(\d+)\s*PPM', txt): attrs["velocidad"] = f"{m.group(1)} ppm"
        con = []
        if "WIFI" in txt: con.append("Wi-Fi")
        if "RED" in txt or "ETHERNET" in txt: con.append("Ethernet")
        if "USB" in txt: con.append("USB")
        if con: attrs["conectividad"] = ", ".join(con)

    if categoria == "NOTEBOOKS":
        m_screen = re.search(r'(?<!\d)(1[1-8](?:\.\d)?)\s*("|PULG|INCH|’| )', txt)
        if m_screen: attrs["pulgadas"] = m_screen.group(1)
        elif re.search(r'\b14\b', txt): attrs["pulgadas"] = "14"
        elif re.search(r'\b15\.6\b', txt): attrs["pulgadas"] = "15.6"

    return attrs

def parsear_meta(html: str, categoria: str, titulo_producto: str = "", rubro_nombre: str = "") -> dict:
    soup = BeautifulSoup(html, "html.parser")
    desc_el = soup.find(id="description")
    descripcion_raw = desc_el.get_text("\n", strip=True) if desc_el else ""
    
    rutas_img = []
    main_el = soup.find("img", id="img_main")
    if main_el and main_el.get("src"): rutas_img.append(main_el["src"])
    for img_el in soup.select("#prod_imgs_alt img"):
        rutas_img.append(img_el.get("src"))
    rutas_img = _deduplicar_imgs(rutas_img)
    placeholder = PLACEHOLDERS.get(categoria, PLACEHOLDERS["DEFAULT"])
    img = rutas_img[0] if rutas_img else placeholder
    galeria = rutas_img[1:4]

    atributos = _extraer_desde_titulo(titulo_producto, categoria)
    
    if descripcion_raw and "Información no disponible" not in descripcion_raw:
        raw_map = {}
        for linea in descripcion_raw.splitlines():
            if ":" in linea:
                k, v = linea.split(":", 1)
                raw_map[k.strip().lower()] = _limpiar_valor(v)
        
        attrs_desc = {}
        if categoria in ["NOTEBOOKS", "COMPUTADORAS"]:
            if "cpu" not in atributos and (v := raw_map.get("procesador")): attrs_desc["cpu"] = _normalizar_cpu(v)
            if "ram" not in atributos and (v := (raw_map.get("memoria ram") or raw_map.get("memoria"))): attrs_desc["ram"] = v
            
            if "almacenamiento" not in atributos and (v := (raw_map.get("capacidad de disco ssd") or raw_map.get("almacenamiento"))):
                attrs_desc["almacenamiento"] = _normalizar_almacenamiento(v)

            if "so" not in atributos and (v := (raw_map.get("sistema operativo") or raw_map.get("s.o."))): 
                attrs_desc["so"] = _normalizar_so(v)

            if "pulgadas" not in atributos and (v := raw_map.get("tamaño de la pantalla")): attrs_desc["pulgadas"] = v
            
            if v := (raw_map.get("tarjeta gráfica") or raw_map.get("video")):
                if v_gpu := _validar_gpu(v): attrs_desc["gpu"] = v_gpu

        elif categoria == "MONITORES":
            if "1920" in descripcion_raw or "FHD" in descripcion_raw: attrs_desc["resolucion"] = "FHD (1920x1080)"
            elif "2560" in descripcion_raw: attrs_desc["resolucion"] = "2K QHD (2560x1440)"
            if "IPS" in descripcion_raw.upper(): attrs_desc["tipo_panel"] = "IPS"
            if "VA" in descripcion_raw.upper(): attrs_desc["tipo_panel"] = "VA"

        elif categoria == "IMPRESORAS":
             m = re.search(r'(\d+)\s*ppm', descripcion_raw, re.IGNORECASE)
             if m and "velocidad" not in atributos: attrs_desc["velocidad"] = f"{m.group(1)} ppm"

        for k, v in attrs_desc.items():
            if k not in atributos: atributos[k] = v

    if categoria == "IMPRESORAS" and "tipo" not in atributos:
        r = rubro_nombre.upper()
        if "LASER" in r or "LED" in r: atributos["tipo"] = "Láser"
        elif "TINTA" in r or "INK" in r or "SIST" in r: atributos["tipo"] = "Inyección de Tinta"

    return {
        "img": img,
        "galeria": galeria,
        "atributos": atributos
    }