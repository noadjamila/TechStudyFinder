from hrk_form_hack.form_hack import fetch_study_programs

if __name__ == "__main__":
    programmes = fetch_study_programs(
        fach="Design",
        studtyp=3,  # "beides"
        studienformen=["v"],  # Vollzeitstudium, if you want to filter
        sachgebiete=["S230"],  # Medieninformatik (example)
    )
    for p in programmes:
        print(p["titel"], "-", p["informationen"].get("Hochschule"), p["detail_url"])
