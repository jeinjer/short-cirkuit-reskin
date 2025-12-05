import json
from pathlib import Path

from services.rubros import parsear_rubros_desde_html
from services.base_catalog_source import obtener_todos_los_productos
from services.catalog_scraper import generar_catalogo_desde_lista

def main():
    base_dir = Path(__file__).resolve().parent
    path_txt = base_dir / "html_catalogos.txt"
    path_salida = base_dir / "data" / "catalogo_full.json"
    
    print("[1/3] Analizando archivo de rubros...")
    rubros_map = parsear_rubros_desde_html(path_txt)
    
    if not rubros_map:
        print("[ERROR] No se encontraron rubros. Revisá 'html_catalogos.txt'.")
        return

    print("\n[2/3] Obteniendo productos base de la API...")
    productos_base = obtener_todos_los_productos(rubros_map)
    
    if not productos_base:
        print("[ERROR] No se pudo obtener ningún producto.")
        return

    print(f"\n[3/3] Refinando datos de {len(productos_base)} productos (esto puede tomar tiempo)...")
    catalogo_final = generar_catalogo_desde_lista(productos_base)

    path_salida.parent.mkdir(parents=True, exist_ok=True)
    with path_salida.open("w", encoding="utf-8") as f:
        json.dump(catalogo_final, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    main()