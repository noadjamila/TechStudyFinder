import { Container, Typography, Box, Link } from "@mui/material";
import MainLayout from "../layouts/MainLayout";
import theme from "../theme/theme";

export default function Datenschutz() {
  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ px: { xs: 1, sm: 3 } }}>
        <Box sx={{ py: 4 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              mb: 2,
              fontSize: { xs: "1.75rem", sm: "1.75rem", md: "2.5rem" },
              "@media (max-width: 375px)": {
                fontSize: "1.5rem",
              },
            }}
          >
            Datenschutzerklärung
          </Typography>

          <Typography variant="body2" sx={{ mb: 4, fontStyle: "italic" }}>
            Stand: 17. Januar 2026
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. In dieser
            Datenschutzerklärung informieren wir Sie transparent darüber, welche
            Daten bei der Nutzung unserer Anwendung erhoben werden, zu welchen
            Zwecken diese verarbeitet werden und welche Rechte Ihnen zustehen.
          </Typography>

          {/* Verantwortliche Stelle - Placeholder */}
          <Typography
            variant="h3"
            sx={{ mb: 2, mt: 4, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            1. Verantwortliche Stelle
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            Verantwortliche Stelle im Sinne des Datenschutzrechts:
            <br />
            <br />
            Gesellschaft für Informatik e.V.
            <br />
            Ahrstraße 45
            <br />
            53175 Bonn
            <br />
            <br />
            E-Mail:{" "}
            <Link
              href="mailto:info@gi.de"
              sx={{ color: theme.palette.detailspage.link }}
            >
              info@gi.de
            </Link>
            <br />
            <br />
            Bei Fragen zum Datenschutz können Sie sich jederzeit an diese
            Adresse wenden.
          </Typography>

          {/* Erhobene Daten */}
          <Typography
            variant="h3"
            sx={{ mb: 2, mt: 4, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            2. Welche Daten werden erhoben?
          </Typography>

          <Typography variant="h4" sx={{ mb: 2, mt: 3, fontSize: "1.1rem" }}>
            2.1 Registrierung und Benutzerkonto
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Wenn Sie ein Benutzerkonto erstellen, erheben wir folgende Daten:
          </Typography>

          <Box component="ul" sx={{ mb: 3, pl: 4 }}>
            <li>
              <Typography variant="body1">
                <strong>Benutzername:</strong> Frei wählbar, 5–30 Zeichen, keine
                E-Mail-Adresse erforderlich
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Passwort:</strong> Wird nicht im Klartext gespeichert,
                sondern mit einem sicheren Hashing-Verfahren verarbeitet.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Zeitstempel der Registrierung:</strong> Datum und
                Uhrzeit der Kontoerstellung
              </Typography>
            </li>
          </Box>

          <Typography variant="body1" sx={{ mb: 4 }}>
            <strong>Zweck der Verarbeitung:</strong> Die Daten werden benötigt,
            um Ihnen ein persönliches Benutzerkonto bereitzustellen und Ihre
            Präferenzen (Favoriten, Quiz-Ergebnisse) zu speichern.
            <br />
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO
            (Vertragserfüllung)
          </Typography>

          <Typography variant="h4" sx={{ mb: 2, mt: 3, fontSize: "1.1rem" }}>
            2.2 Favoriten
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Wenn Sie Studiengänge als Favoriten markieren, speichern wir:
          </Typography>

          <Box component="ul" sx={{ mb: 3, pl: 4 }}>
            <li>
              <Typography variant="body1">
                <strong>Studiengang-IDs:</strong> Kennungen der von Ihnen
                favorisierten Studiengänge
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Verknüpfung zu Ihrem Benutzerkonto:</strong> Zuordnung
                der Favoriten zu Ihrer Benutzer-ID
              </Typography>
            </li>
          </Box>

          <Typography variant="body1" sx={{ mb: 4 }}>
            <strong>Zweck der Verarbeitung:</strong> Die Speicherung ermöglicht
            es Ihnen, Ihre Favoriten dauerhaft zu speichern und auf allen
            Geräten abzurufen.
            <br />
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO
            (Vertragserfüllung)
          </Typography>

          <Typography variant="h4" sx={{ mb: 2, mt: 3, fontSize: "1.1rem" }}>
            2.3 Quiz-Ergebnisse
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Wenn Sie das Studienempfehlungs-Quiz durchführen und angemeldet
            sind, speichern wir:
          </Typography>

          <Box component="ul" sx={{ mb: 3, pl: 4 }}>
            <li>
              <Typography variant="body1">
                <strong>Liste der empfohlenen Studiengänge:</strong> IDs der für
                Sie ermittelten Studienprogramme
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Zeitstempel der letzten Aktualisierung:</strong> Datum
                und Uhrzeit der letzten Quiz-Durchführung
              </Typography>
            </li>
          </Box>

          <Typography variant="body1" sx={{ mb: 4 }}>
            <strong>Zweck der Verarbeitung:</strong> Die Speicherung ermöglicht
            es Ihnen, Ihre Quiz-Ergebnisse später wieder abzurufen und bis zur
            erneuten Durchführung des Quiz bereitzustellen.
            <br />
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO
            (Vertragserfüllung)
          </Typography>

          {/* Session Cookie */}
          <Typography
            variant="h3"
            sx={{ mb: 2, mt: 4, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            3. Session-Cookie
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            Wir verwenden ein Session‑Cookie, um die Anmeldung und die
            Sitzungsverwaltung zu ermöglichen. Das Cookie ist technisch
            notwendig, damit angemeldete Nutzer*innen auf geschützte Funktionen
            zugreifen können. Das Cookie wird spätestens nach 24 Stunden
            automatisch gelöscht oder bereits beim Schließen des Browsers,
            sofern die Sitzung zuvor endet. Eine Weitergabe an Dritte erfolgt
            nicht.
            <br />
            <br />
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO
            (Vertragserfüllung). Das Setzen des Cookies ist gemäß § 25 Abs. 2
            Nr. 2 TTDSG einwilligungsfrei zulässig.
          </Typography>

          {/* Weitergabe an Dritte */}
          <Typography
            variant="h3"
            sx={{ mb: 2, mt: 4, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            4. Weitergabe von Daten an Dritte
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            Ihre Daten werden nicht an Dritte weitergegeben, verkauft oder für
            Werbezwecke genutzt. Eine Übermittlung erfolgt nur, wenn dies
            gesetzlich vorgeschrieben ist.
          </Typography>

          {/* Speicherdauer */}
          <Typography
            variant="h3"
            sx={{ mb: 2, mt: 4, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            5. Speicherdauer
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Wir speichern Ihre Daten nur so lange, wie dies für die jeweiligen
            Zwecke erforderlich ist:
          </Typography>

          <Box component="ul" sx={{ mb: 4, pl: 4 }}>
            <li>
              <Typography variant="body1">
                <strong>Session-Cookie:</strong> Maximal 24 Stunden oder beim
                Schließen des Browsers
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>
                  Benutzerkonto-Daten, Favoriten und Quiz-Ergebnisse:
                </strong>{" "}
                Solange Ihr Konto besteht (werden bei Kontolöschung automatisch
                gelöscht)
              </Typography>
            </li>
          </Box>

          {/* Ihre Rechte */}
          <Typography
            variant="h3"
            sx={{ mb: 2, mt: 4, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            6. Ihre Rechte
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:
          </Typography>

          <Box component="ul" sx={{ mb: 4, pl: 4 }}>
            <li>
              <Typography variant="body1">
                <strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Sie können
                Auskunft darüber verlangen, welche Daten wir über Sie speichern.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Recht auf Berichtigung (Art. 16 DSGVO):</strong> Sie
                können die Korrektur unrichtiger Daten verlangen.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Recht auf Löschung (Art. 17 DSGVO):</strong> Sie können
                die Löschung Ihrer Daten verlangen. Dies können Sie direkt in
                den Einstellungen Ihres Benutzerkontos durchführen.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>
                  Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO):
                </strong>{" "}
                Sie können die Einschränkung der Verarbeitung verlangen.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Recht auf Datenübertragbarkeit (Art. 20 DSGVO):</strong>{" "}
                Sie können verlangen, dass wir Ihre Daten in einem
                strukturierten, gängigen und maschinenlesbaren Format
                bereitstellen.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie können
                der Verarbeitung Ihrer Daten widersprechen.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>Beschwerderecht:</strong> Sie haben das Recht, sich bei
                einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer
                Daten zu beschweren.
              </Typography>
            </li>
          </Box>

          <Typography variant="body1" sx={{ mb: 4 }}>
            Zur Ausübung Ihrer Rechte wenden Sie sich bitte an die oben genannte
            Kontaktadresse.
          </Typography>

          {/* Datensicherheit */}
          <Typography
            variant="h3"
            sx={{ mb: 2, mt: 4, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            7. Datensicherheit
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein,
            um Ihre Daten gegen Manipulation, Verlust, Zerstörung oder den
            Zugriff unberechtigter Personen zu schützen. Insbesondere:
          </Typography>

          <Box component="ul" sx={{ mb: 4, pl: 4 }}>
            <li>
              <Typography variant="body1">
                Passwörter werden mit modernen Hashing-Algorithmen (z. B.
                bcrypt) gesichert gespeichert
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Verschlüsselte Verbindungen (HTTPS) für die Datenübertragung
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Regelmäßige Sicherheitsupdates der verwendeten Software
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Zugriffsbeschränkungen auf die Datenbank
              </Typography>
            </li>
          </Box>

          {/* Studiengangs-Daten */}
          <Typography
            variant="h3"
            sx={{ mb: 2, mt: 4, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            8. Studiengangs-Informationen
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            Die in der Anwendung dargestellten Informationen zu Studiengängen
            werden uns von Kooperationspartnern bzw. Dritten zur Verfügung
            gestellt. Die Nutzung dieser Daten erfolgt auf vertraglicher
            Grundlage.
            <br />
            <br />
            Bei den dargestellten Informationen handelt es sich um sachliche
            Angaben zu Studienprogrammen ohne Personenbezug. Es werden in diesem
            Zusammenhang keine personenbezogenen Daten verarbeitet.
          </Typography>

          {/* Änderungen */}
          <Typography
            variant="h3"
            sx={{ mb: 2, mt: 4, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            9. Änderungen dieser Datenschutzerklärung
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie
            an geänderte Rechtslagen oder bei Änderungen unserer Dienste sowie
            der Datenverarbeitung anzupassen. Das aktuelle Datum der letzten
            Änderung ist jeweils oben in dieser Erklärung angegeben. Wir
            empfehlen Ihnen, diese Seite regelmäßig aufzurufen, um über mögliche
            Änderungen informiert zu bleiben.
          </Typography>

          {/* Kontakt */}
          <Typography
            variant="h3"
            sx={{ mb: 2, mt: 4, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            10. Kontakt
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            Bei Fragen zur Verarbeitung Ihrer Daten oder zur Ausübung Ihrer
            Rechte können Sie sich jederzeit an die unter Punkt 1 genannte
            Kontaktadresse wenden.
          </Typography>
        </Box>
      </Container>
    </MainLayout>
  );
}
