import re


def limpiar_html_a_texto(fragmento_html: str) -> str:
    if not fragmento_html:
        return ""

    txt = fragmento_html

    txt = txt.replace("<br>", "\n").replace("<br/>", "\n").replace("<br />", "\n")
    txt = txt.replace("\r\n", "\n")
    
    txt = re.sub(r"<[^>]+>", "", txt)
    txt = re.sub(r"\n+", "\n", txt)
    
    txt = txt.strip().strip('"').strip()

    return txt
