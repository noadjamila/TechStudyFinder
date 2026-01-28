CREATE VIEW studiengang_full_view AS
SELECT
  s.id                               AS studiengang_id,
  s.name,
  h.name                             AS hochschule,
  s.abschluss_intern                 AS abschluss,
  s.homepage,
  s.studienbeitrag,
  s.beitrag_kommentar,
  s.anmerkungen,
  s.regelstudienzeit,
  s.zulassungssemester,
  s.zulassungsmodus,
  s.zulassungsvoraussetzungen,
  s.zulassungs_link                  AS zulassungslink,
array_agg(DISTINCT sch.name ORDER BY sch.name)
  FILTER (WHERE sch.name IS NOT NULL) AS schwerpunkte,
array_agg(DISTINCT sp.name ORDER BY sp.name)
  FILTER (WHERE sp.name IS NOT NULL) AS sprachen,
array_agg(DISTINCT st.name ORDER BY st.name)
  FILTER (WHERE st.name IS NOT NULL) AS standorte,
array_agg(DISTINCT stf.name ORDER BY stf.name)
  FILTER (WHERE stf.name IS NOT NULL) AS studienfelder,
array_agg(DISTINCT stfo.name ORDER BY stfo.name)
  FILTER (WHERE stfo.name IS NOT NULL) AS studienform
FROM studiengaenge s
JOIN hochschule h
  ON s.hochschule_id = h.id
LEFT JOIN studiengang_schwerpunkte_relation ssr
  ON ssr.studiengang_id = s.id
LEFT JOIN schwerpunkte sch
  ON sch.id = ssr.schwerpunkt_id
LEFT JOIN studiengang_sprachen_relation stspr
  ON stspr.studiengang_id = s.id
LEFT JOIN unterrichtssprachen sp
  ON sp.id = stspr.sprache_id
LEFT JOIN studiengang_standorte_relation ststr
  ON ststr.studiengang_id = s.id
LEFT JOIN standorte st
  ON st.id = ststr.standort_id
LEFT JOIN studiengang_studienfelder_relation ststfr
  ON ststfr.studiengang_id = s.id
LEFT JOIN studienfelder stf
  ON stf.id = ststfr.studienfeld_id
LEFT JOIN studiengang_studienform_relation ststfor
  ON ststfor.studiengang_id = s.id
LEFT JOIN studienform stfo
  ON stfo.id = ststfor.studienform_id
GROUP BY
  s.id,
  s.name,
  h.name,
  s.abschluss_intern,
  s.homepage,
  s.studienbeitrag,
  s.beitrag_kommentar,
  s.anmerkungen,
  s.regelstudienzeit,
  s.zulassungssemester,
  s.zulassungsmodus,
  s.zulassungsvoraussetzungen,
  s.zulassungs_link;
