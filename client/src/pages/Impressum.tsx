import { Container, Typography, Box, Link } from "@mui/material";
import MainLayout from "../layouts/MainLayout";
import theme from "../theme/theme";

export default function Impressum() {
  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ px: { xs: 1, sm: 3 } }}>
        <Box sx={{ py: 4 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{ mb: 4, fontSize: { xs: "1.75rem", sm: "2.5rem" } }}
          >
            Impressum
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Angaben gemäß Digitale-Dienste-Gesetz (DDG).
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            Gesellschaft für Informatik e.V. (GI)
            <br />
            Ahrstraße 45
            <br />
            53175 Bonn
            <br />
            Deutschland
            <br />
            <br />
            Telefon: +49 (0)228 302-145
            <br />
            E-Mail:{" "}
            <Link
              href="mailto:info@gi.de"
              sx={{ color: theme.palette.detailspage.link }}
            >
              info@gi.de
            </Link>
            <br />
            Internet:{" "}
            <Link
              href="https://www.gi.de"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: theme.palette.detailspage.link }}
            >
              https://www.gi.de
            </Link>
          </Typography>

          <Typography
            variant="h3"
            component="h2"
            sx={{
              mt: 4,
              mb: 2,
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              wordBreak: "break-word",
              hyphens: "auto",
            }}
          >
            Vertretungs&shy;berechtigter Vorstand
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Die Gesellschaft für Informatik e.V. wird gesetzlich vertreten durch
            den Vorstand.
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Präsident:
            <br />
            Prof. Dr. Martin R. Wolf
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            Vizepräsidentinnen und Vizepräsidenten:
            <br />
            Dr. Katharina Weitz
            <br />
            Prof. Dr. Nadine Bergner
            <br />
            Prof. Dr. Friedrich Steimann
          </Typography>

          <Typography
            variant="h3"
            component="h2"
            sx={{ mt: 4, mb: 2, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            Vereinsregister
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            Eingetragen im Vereinsregister des Amtsgerichts Bonn unter der
            Registernummer VR 3429
          </Typography>

          <Typography
            variant="h3"
            component="h2"
            sx={{ mt: 4, mb: 2, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            Umsatzsteuer-ID
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
            <br />
            (DE122273104)
          </Typography>

          <Typography
            variant="h3"
            component="h2"
            sx={{ mt: 4, mb: 2, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            Inhaltlich verantwortlich gemäß § 18 Abs. 2 MStV
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            Frithjof Nagel
            <br />
            Gesellschaft für Informatik e.V.
            <br />
            Weydingerstr. 14-16
            <br />
            10178 Berlin
            <br />
            <br />
            E-Mail:{" "}
            <Link
              href="mailto:berlin@gi.de"
              sx={{ color: theme.palette.detailspage.link }}
            >
              berlin@gi.de
            </Link>
          </Typography>

          <Typography
            variant="h3"
            component="h2"
            sx={{ mt: 4, mb: 2, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            Haftungshinweis
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte
            in dieser App nach den allgemeinen Gesetzen verantwortlich. Nach §§
            8 bis 10 DDG sind wir jedoch nicht verpflichtet, übermittelte oder
            gespeicherte fremde Informationen zu überwachen oder nach Umständen
            zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            <br />
            <br />
            Bitte lesen Sie hierzu auch die Datenschutzbestimmungen der
            Gesellschaft für Informatik e.V.:{" "}
            <Link
              href="https://gi.de/datenschutz"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: theme.palette.detailspage.link }}
            >
              https://gi.de/datenschutz
            </Link>
          </Typography>

          <Typography
            variant="h3"
            component="h2"
            sx={{ mt: 4, mb: 2, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            Haftung für externe Links
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            Diese App kann Links zu externen Webseiten Dritter enthalten, auf
            deren Inhalte wir keinen Einfluss haben. Für diese fremden Inhalte
            wird keine Gewähr übernommen. Für die Inhalte der verlinkten Seiten
            ist stets der jeweilige Anbieter oder Betreiber der Seiten
            verantwortlich.
          </Typography>

          <Typography
            variant="h3"
            component="h2"
            sx={{ mt: 4, mb: 2, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
          >
            Zweck der App
          </Typography>

          <Typography variant="body1" sx={{ mb: 4 }}>
            Diese App dient der Recherche und Information über Studiengänge im
            Bereich der Informatik und informatiknaher Studiengänge. Die
            Studiengangsdaten werden durch die Hochschulrektorenkonferenz
            bereitgestellt. Die bereitgestellten Informationen erfolgen ohne
            Gewähr auf Vollständigkeit, Aktualität oder Richtigkeit.
          </Typography>
        </Box>
      </Container>
    </MainLayout>
  );
}
