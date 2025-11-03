import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

BASE_URL = "https://www.hochschulkompass.de"
SEARCH_URL = urljoin(BASE_URL, "/studium/studiengangsuche/erweiterte-studiengangsuche.html")


def fetch_study_programs(
        fach: str = "",
        studtyp: int | None = 3,
        ohne_lehramt: bool = False,
        zubesch: list[str] | None = None,
        zusemester: str | None = None,
        berufliche_qualifikation_1: bool = False,
        berufliche_qualifikation_2: bool = False,
        berufliche_qualifikation_3: bool = False,
        abschluss: list[str] | None = None,
        lehramt: str | None = None,
        sprache: str | None = None,
        studienformen: list[str] | None = None,
        besand: bool = False,
        mastertyp: list[str] | None = None,
        intdop: bool = False,
        sachgebiete: list[str] | None = None,
        sachgrand: bool = False,
        name: str | None = None,
        plz: str | None = None,
        ort: str | None = None,
        hstype: dict[int, bool] | None = None,
        prom: bool = False,
        verbund: bool = False,
        traegerschaft: str | None = None,
        bundeslaender: list[str] | None = None,
        plzdist: str | None = None,
        timeout: int = 20,
) -> list[dict]:
    """
    Query Hochschulkompass extended search and parse result boxes.

    All parameters roughly mirror the form fields in the HTML you pasted.
    Only a subset is implemented here; extend as needed.
    """

    # Build form payload exactly like the HTML form expects
    payload: dict[str, str | int] = {
        "gfi": "1",
        "tx_szhrksearch_pi1[search]": "1",
        "genios": "",
        "tx_szhrksearch_pi1[view]": "",
    }

    # Simple text field
    if fach:
        payload["tx_szhrksearch_pi1[fach]"] = fach

    # Studientyp (1 = grundständig, 2 = weiterführend, 3 = beides)
    if studtyp is not None:
        payload["tx_szhrksearch_pi1[studtyp]"] = str(studtyp)

    # ohne Lehramt
    if ohne_lehramt:
        payload["tx_szhrksearch_pi1[ohnelehramt]"] = "1"

    # Zulassungsmodus checkboxes: values like "O", "X", "A", "E"
    if zubesch:
        for val in zubesch:
            payload.setdefault("tx_szhrksearch_pi1[zubesch][]", [])
        # requests encodes list values correctly if we give a list explicitly
        payload["tx_szhrksearch_pi1[zubesch][]"] = zubesch

    # Studienbeginn
    if zusemester:
        payload["tx_szhrksearch_pi1[zusemester]"] = zusemester

    # Studieren ohne Abitur
    if berufliche_qualifikation_1:
        payload["tx_szhrksearch_pi1[berufliche_qualifikation_1]"] = "1"
    if berufliche_qualifikation_2:
        payload["tx_szhrksearch_pi1[berufliche_qualifikation_2]"] = "1"
    if berufliche_qualifikation_3:
        payload["tx_szhrksearch_pi1[berufliche_qualifikation_3]"] = "1"

    # Abschluss (list of numeric codes as strings, e.g. "37" for Master)
    if abschluss:
        payload["tx_szhrksearch_pi1[abschluss][]"] = abschluss

    # Lehramt
    if lehramt:
        payload["tx_szhrksearch_pi1[lehramt]"] = lehramt

    # Sprache
    if sprache:
        payload["tx_szhrksearch_pi1[sprache]"] = sprache

    # Studienformen (besform[]: 'b','d','a','c','p','f','i','t','v')
    if studienformen:
        payload["tx_szhrksearch_pi1[besform][]"] = studienformen

    if besand:
        payload["tx_szhrksearch_pi1[besand]"] = "1"

    # Mastertyp
    if mastertyp:
        payload["tx_szhrksearch_pi1[master][]"] = mastertyp

    if intdop:
        payload["tx_szhrksearch_pi1[intdop]"] = "1"

    # Sachgebiete / Fächergruppen / Studienbereiche / -felder (sachgr[])
    if sachgebiete:
        payload["tx_szhrksearch_pi1[sachgr][]"] = sachgebiete

    if sachgrand:
        payload["tx_szhrksearch_pi1[sachgrand]"] = "1"

    # Hochschulname, PLZ, Ort
    if name:
        payload["tx_szhrksearch_pi1[name]"] = name
    if plz:
        payload["tx_szhrksearch_pi1[plz]"] = plz
    if ort:
        payload["tx_szhrksearch_pi1[ort]"] = ort

    # Hochschultyp (hstype[1..5]=1)
    if hstype:
        for key, active in hstype.items():
            if active:
                payload[f"tx_szhrksearch_pi1[hstype][{key}]"] = "1"

    if prom:
        payload["tx_szhrksearch_pi1[prom]"] = "1"
    if verbund:
        payload["tx_szhrksearch_pi1[verbund]"] = "1"

    # Trägerschaft
    if traegerschaft:
        payload["tx_szhrksearch_pi1[traegerschaft]"] = traegerschaft

    # Bundesland[]
    if bundeslaender:
        payload["tx_szhrksearch_pi1[bundesland][]"] = bundeslaender

    # Umkreis zur PLZ
    if plzdist:
        payload["tx_szhrksearch_pi1[plzdist]"] = plzdist

    headers = {
        "User-Agent": (
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/131.0 Safari/537.36"
        ),
        "Referer": SEARCH_URL,
    }

    # Send POST request (the original form uses GET; POST usually works as well)
    with requests.Session() as s:
        response = s.post(SEARCH_URL, data=payload, headers=headers, timeout=timeout)
        response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    results: list[dict] = []
    for section in soup.select("div.clearfix.result-section section.result-box"):
        # Name of the study program
        title_tag = section.find("h2")
        title = title_tag.get_text(strip=True) if title_tag else ""

        # Info list
        info_dict: dict[str, str] = {}
        for li in section.select("ul.info li"):
            key_span = li.find("span", class_="title")
            val_span = li.find("span", class_="status")
            if not key_span or not val_span:
                continue
            key = key_span.get_text(strip=True)
            # status might contain nested <span> for SIT, so get_text
            val = val_span.get_text(" ", strip=True)
            info_dict[key] = val

        # "Mehr Erfahren" link
        link_tag = section.find("a", class_="btn-info")
        detail_url = None
        if link_tag and link_tag.has_attr("href"):
            detail_url = urljoin(BASE_URL, link_tag["href"])

        results.append(
            {
                "titel": title,
                "informationen": info_dict,
                "detail_url": detail_url,
            }
        )

    return results
