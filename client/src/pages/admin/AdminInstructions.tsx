/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Layout from "../../layouts/AdminLayout";
import theme from "../../theme/theme";
import { alpha } from "@mui/material/styles";

const cardBaseSx = {
  px: 4,
  py: { xs: 2, md: 3 },
  width: "100%",
  backgroundColor: alpha(theme.palette.decorative.pink, 0.3),
  mb: 2,
  maxWidth: "800px",
  alignItems: "center",
};

export default function AdminInstructions() {
  return (
    <Layout>
      <Box
        mt={4}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h2"
          align="center"
          style={{ marginBottom: "30px" }}
          gutterBottom
        >
          Anleitung zur RIASEC-Zuordnung
        </Typography>

        {/* Einführung */}
        <Accordion sx={{ ...cardBaseSx }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">
              Einführung in RIASEC und dessen Nutzung
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Das <strong>RIASEC-Modell</strong> (Holland-Codes) klassifiziert
              Interessen und Persönlichkeitstypen in sechs Kategorien:
              Realistic, Investigative, Artistic, Social, Enterprising und
              Conventional.
            </Typography>
            <Typography>
              In dieser Anwendung wird jedem Studiengang ein
              <strong> RIASEC-Profil</strong> mit Werten von{" "}
              <strong>1 bis 5</strong> zugewiesen. Dies ermöglicht einen
              strukturierten Abgleich mit den Interessen der Nutzer:innen.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Mapping Prozess */}
        <Accordion sx={{ ...cardBaseSx }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">
              Erklärung des Mapping-Prozesses
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Das Mapping kombiniert manuelle und automatische Schritte. Die
              Zuordnung erfolgt primär über <strong>Studienbereiche</strong>, da
              diese eine übergeordnete Ebene bilden und sich seltener ändern als
              einzelne Studiengänge.
            </Typography>

            <Typography variant="subtitle1" gutterBottom mt={2}>
              Vorgehen
            </Typography>
            <Typography component="ol">
              <li>
                RIASEC-Zuordnung auf Ebene der Studienbereiche (6 Werte von 1–5)
              </li>
              <li>
                Automatische Vererbung auf Fachrichtungen mit optionaler
                Feinjustierung
              </li>
              <li>
                Berechnung der Studiengangswerte über den arithmetischen
                Mittelwert
              </li>
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* RIASEC Typen */}
        <Accordion sx={{ ...cardBaseSx }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">RIASEC-Typen & Bewertung</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography style={{ marginBottom: "16px" }}>
              Die Ausprägung jedes RIASEC-Typs von einem Studienbereich, einer
              Fachrichtung oder einem Studiengang wird auf einer Skala von{" "}
              <strong>1 (trifft nicht zu)</strong> bis{" "}
              <strong>5 (trifft vollständig zu)</strong> bewertet.
            </Typography>

            <Typography variant="subtitle1">R – Realistic</Typography>
            <Typography style={{ marginBottom: "16px" }}>
              Praktische, handwerkliche, technische oder mechanische Tätigkeiten
              mit sichtbaren Ergebnissen.
            </Typography>

            <Typography variant="subtitle1">I – Investigative</Typography>
            <Typography style={{ marginBottom: "16px" }}>
              Analytische, forschende und wissenschaftliche Tätigkeiten.
            </Typography>

            <Typography variant="subtitle1">A – Artistic</Typography>
            <Typography style={{ marginBottom: "16px" }}>
              Kreativer Ausdruck durch Kunst, Musik, Sprache oder Design.
            </Typography>

            <Typography variant="subtitle1">S – Social</Typography>
            <Typography style={{ marginBottom: "16px" }}>
              Helfen, Lehren, Beraten und soziale Interaktion.
            </Typography>

            <Typography variant="subtitle1">E – Enterprising</Typography>
            <Typography style={{ marginBottom: "16px" }}>
              Führen, Überzeugen, Verkaufen und unternehmerisches Handeln.
            </Typography>

            <Typography variant="subtitle1">C – Conventional</Typography>
            <Typography style={{ marginBottom: "16px" }}>
              Strukturierte, organisatorische oder verwaltende Tätigkeiten mit
              klaren Regeln.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Layout>
  );
}
