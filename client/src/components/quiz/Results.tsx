import React from "react";
import {
  Box,
  Typography,
  IconButton,
  ThemeProvider,
  Stack,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import { GridLegacy as Grid } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import theme from "../../theme/theme";
import { StudyProgramme } from "../../types/StudyProgramme.types";
import PlaceIcon from "@mui/icons-material/Place";
import StarsIcon from "@mui/icons-material/Stars";

interface ResultsProps {
  studyProgrammes: StudyProgramme[];
}

/**
 * Results component displays filtered study programmes.
 * Receives study programmes as props from parent component.
 */
const Results: React.FC<ResultsProps> = ({ studyProgrammes }) => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          maxWidth: 800,
          margin: "0 auto",
          padding: 3,
          minHeight: "100vh",
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{ color: "#4A4458", marginBottom: 3 }}
        >
          Meine Ergebnisse
        </Typography>

        {studyProgrammes.length === 0 ? (
          <Box sx={{ padding: 2 }}>
            <Typography variant="h6">No study programmes found</Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your quiz answers
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: "100%" }}>
            {studyProgrammes.map((programme, index) => (
              <React.Fragment key={programme.id}>
                <ListItem
                  sx={{
                    padding: 2,
                    transition: "background-color 0.3s",
                    "&:hover": {
                      backgroundColor: "#D5F3AC",
                    },
                  }}
                >
                  <Grid
                    container
                    spacing={2}
                    alignItems="flex-start"
                    sx={{ width: "100%" }}
                  >
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        {programme.name}
                      </Typography>
                      <IconButton aria-label="favorite" sx={{ ml: 1 }}>
                        <FavoriteIcon />
                      </IconButton>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" alignItems="center" gap={0.5}>
                        <PlaceIcon
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {programme.university}
                        </Typography>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" alignItems="center" gap={0.5}>
                        <StarsIcon
                          sx={{ fontSize: 18, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {programme.degree}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                {index < studyProgrammes.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Results;
