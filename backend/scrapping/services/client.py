import requests
from dotenv import load_dotenv
import os

load_dotenv()


BASE_META_URL = os.getenv("BASE_META_URL")
CUIT = os.getenv("CUIL")


def obtener_html_meta(codiart: str) -> str | None:
    params = {
        "cuit": CUIT,
        "codiart": codiart,
    }

    try:
        resp = requests.get(BASE_META_URL, params=params, timeout=10)
        resp.raise_for_status()
        return resp.text
    except Exception as e:
        print(f"[WARN] No se pudo obtener meta para {codiart}: {e}")
        return None
