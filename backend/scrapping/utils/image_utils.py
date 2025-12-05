from urllib.parse import urljoin, urlparse
import os
from dotenv import load_dotenv

load_dotenv()

BASE_META_HTML = os.getenv("BASE_META_URL")

def absolutizar_url_img(src: str) -> str:
    if not src:
        return ""

    src = src.strip()

    if "nd.png" in src.lower():
        return ""

    if src.lower().startswith("http"):
        return src

    return urljoin(BASE_META_HTML, src)


def dedupe_urls_por_nombre(urls):
    unicas = []
    vistos = set()

    for u in urls:
        if not u:
            continue

        parsed = urlparse(u)
        filename = os.path.basename(parsed.path)
        stem = filename.split(".")[0]            

        if stem in vistos:
            continue

        vistos.add(stem)
        unicas.append(u)

    return unicas


def resolver_placeholder(categoria_destino: str, subcategoria_destino: str, marca: str) -> str:
    cat = (categoria_destino or "").upper()
    sub = (subcategoria_destino or "").upper()

    if "NOTEBOOK" in cat or "LAPTOP" in cat or "NOTEBOOK" in sub:
        return "https://d2t1xqejof9utc.cloudfront.net/screenshots/pics/23a70a7b019b584ae08b402b5dd4ab2d/large.png"

    if any(x in cat for x in ["PC", "COMPUTADORA", "CPU"]):
        return "https://cdn-icons-png.freepik.com/512/2330/2330501.png"

    return "https://pngimg.com/d/question_mark_PNG99.png"
