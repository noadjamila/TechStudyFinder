import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import HRKLogo from "../assets/HRK_logo.png";

/**
 * DataSource component displays the HRK (Hochschulrektorenkonferenz) logo
 * and attribution text for the data source.
 */
export default function DataSource() {
  const HRK_WEBSITE_URL = "https://www.hrk.de/"; // TODO: Add HRK website URL

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        my: 4,
      }}
    >
      <Box
        component="a"
        href={HRK_WEBSITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          cursor: "pointer",
          transition: "opacity 0.2s",
          "&:hover": {
            opacity: 0.8,
          },
        }}
      >
        <Box
          component="img"
          src={HRKLogo}
          alt="HRK Logo"
          sx={{
            maxWidth: 200,
            height: "auto",
          }}
        />
      </Box>
      <Typography
        variant="body2"
        align="center"
        sx={{
          maxWidth: 600,
          px: 2,
        }}
      >
        Die Informationen über die Hochschulen und deren Studienangebote werden
        durch Zugriff auf den Hochschulkompass der Hochschulrektorenkonferenz
        (HRK) erzeugt.
      </Typography>
    </Box>
  );
}
