import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  CircularProgress,
  Alert,
  alpha,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useMemo, useState } from "react";
import Layout from "../../layouts/AdminLayout";
import RiasecTable from "../../components/admin/RiasecTable";
import theme from "../../theme/theme";
import { useNavigate } from "react-router-dom";
import { RiasecData } from "../../types/RiasecTypes";

/**
 * AdminEdit Component
 *
 * This component allows viewing and managing RIASEC data for:
 * studiengebiete (study areas), studienfelder (study fields), studiengaenge (study programs)
 *
 * Features:
 * - Fetches data from /api/admin/riasec-data on mount
 * - Shows loading indicator (CircularProgress), error alert (Alert), and warning if some RIASEC values are null
 * - Displays the three tables in expandable Accordions
 * - Clickable box navigates to instructions page
 *
 * Hooks:
 * - useEffect: fetches data on component mount
 * - useMemo: checks if RIASEC values are null (`hasNullRiasecValues`)
 */
export default function AdminEdit() {
  const navigate = useNavigate();
  const [error, setError] = useState<{ title: string; message: string } | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [riasecData, setRiasecData] = useState<RiasecData>({
    studiengebiete: [],
    studienfelder: [],
    studiengaenge: [],
  });

  const hasNullRiasecValues = useMemo(() => {
    if (!riasecData.studiengebiete || riasecData.studiengebiete.length === 0)
      return false;

    return riasecData.studiengebiete.some((gebiet) =>
      [gebiet.R, gebiet.I, gebiet.A, gebiet.S, gebiet.E, gebiet.C].some(
        (value) => value === null,
      ),
    );
  }, [riasecData.studiengebiete]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/admin/riasec-data`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("RIASEC Data:", data);

      setRiasecData({
        studiengebiete: data.studiengebiete || [],
        studienfelder: data.studienfelder || [],
        studiengaenge: data.studiengaenge || [],
      });
    } catch (err) {
      console.error(err);
      setError({
        title: "Fehler beim Laden der Daten",
        message:
          "Die Daten konnten nicht geladen werden. Bitte versuche es später erneut.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getDisplayName = (key: string): string => {
    const names: { [key: string]: string } = {
      studiengebiete: "Studiengebiete",
      studienfelder: "Studienfelder",
      studiengaenge: "Studiengänge",
    };
    return names[key] || key;
  };

  const getItemCount = (key: keyof RiasecData): number => {
    return riasecData[key]?.length || 0;
  };

  const handleUpdate = () => {
    fetchData();
  };

  return (
    <Layout>
      <Box
        sx={{
          maxWidth: "800px",
          mx: "auto",
        }}
      >
        <Typography
          variant="h2"
          align="center"
          sx={{
            mb: 3,
            color: theme.palette.text.primary,
          }}
        >
          Daten verwalten
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: theme.palette.text.primary,
          }}
        >
          Hier kannst du die RIASEC-Daten für Studiengebiete, Studienfelder und
          Studiengänge einsehen und verwalten. <br />
          Für Erklärungen und Anleitungen klicke hier:
        </Typography>

        <Box
          onClick={() => {
            navigate("/admin/instructions");
          }}
          sx={{ mb: 4, display: "flex", justifyContent: "center" }}
        >
          <Typography
            variant="body1"
            sx={{
              mb: 1,
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.decorative.pink,
              borderRadius: "9px",
              px: 5,
              py: 2,
              display: "inline-block",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: theme.palette.secondary.main,
              },
            }}
          >
            Erklärungen & Anleitungen
          </Typography>
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "400px",
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress
                sx={{
                  color: theme.palette.primary.main,
                  mb: 2,
                }}
              />
              <Typography
                variant="body1"
                sx={{ color: theme.palette.text.subHeader }}
              >
                Daten werden geladen...
              </Typography>
            </Box>
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            sx={{
              mb: 4,
              borderRadius: "9px",
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
              {error.title}
            </Typography>
            <Typography variant="body2">{error.message}</Typography>
          </Alert>
        ) : (
          <>
            {hasNullRiasecValues && (
              <Alert
                severity="warning"
                sx={{
                  mb: 4,
                  borderRadius: "9px",
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Warnung: Unvollständige RIASEC-Daten
                </Typography>
                <Typography variant="body2">
                  Einige Studiengebiete haben unvollständige RIASEC-Werte
                  (null). Bitte überprüfe die Daten und vervollständige sie.
                </Typography>
              </Alert>
            )}
            <Box>
              {(
                ["studiengebiete", "studienfelder", "studiengaenge"] as const
              ).map((key) => {
                const items = riasecData[key] || [];
                const count = getItemCount(key);

                return (
                  <Accordion
                    key={key}
                    defaultExpanded
                    sx={{
                      mb: 3,
                      borderRadius: "9px",
                      backgroundColor: theme.palette.background.default,
                      boxShadow: `0 2px 8px ${alpha(
                        theme.palette.primary.main,
                        0.1,
                      )}`,
                      "&:before": {
                        display: "none",
                      },
                      "&.Mui-expanded": {
                        margin: "0 0 24px 0",
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <ExpandMoreIcon
                          sx={{
                            color: theme.palette.text.primary,
                          }}
                        />
                      }
                      sx={{
                        backgroundColor: theme.palette.decorative.blue,
                        borderRadius: "9px 9px 0 0",
                        minHeight: 64,
                        "&.Mui-expanded": {
                          minHeight: 64,
                          borderRadius: "9px 9px 0 0",
                        },
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.decorative.blueDark,
                            0.8,
                          ),
                        },
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        {getDisplayName(key)}
                        <Box
                          component="span"
                          sx={{
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.text.primary,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: "12px",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            ml: 1,
                          }}
                        >
                          {count}
                        </Box>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        p: 3,
                        backgroundColor: alpha(
                          theme.palette.background.paper,
                          0.4,
                        ),
                        borderRadius: "0 0 9px 9px",
                      }}
                    >
                      {items.length > 0 ? (
                        <RiasecTable
                          items={items}
                          tableKey={key}
                          onUpdate={() => handleUpdate()}
                        />
                      ) : (
                        <Box
                          sx={{
                            textAlign: "center",
                            py: 4,
                            color: theme.palette.text.subHeader,
                          }}
                        >
                          <Typography variant="body1">
                            Keine Einträge vorhanden
                          </Typography>
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Box>
          </>
        )}
      </Box>
    </Layout>
  );
}
