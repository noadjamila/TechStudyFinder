/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

type Level = 1 | 2 | 3 | 4;
type Phase = "won" | "next";

export type LevelSuccessScreenProps = {
  currentLevel: Level;
  onContinue: () => void;
};
type LevelConfig = {
  wonTitle?: string;
  nextTitle?: string;
  nextText?: string;
};

const NEXT_LEVEL_TEXT: Record<Level, string> = {
  1: "Deine Rahmenbedingungen",
  2: "Deine Interessen",
  3: "Du hast alle Schritte abgeschlossen",
  4: "",
};

const LEVEL_CONFIG: Record<Level, LevelConfig> = {
  1: { nextTitle: "Schritt 1", nextText: NEXT_LEVEL_TEXT[1] },
  2: {
    wonTitle: "Schritt 1 geschafft!",
    nextTitle: "Schritt 2",
    nextText: NEXT_LEVEL_TEXT[2],
  },
  3: {
    wonTitle: "Schritt 2 geschafft!",
    nextTitle: "Deine Ergebnisse",
    nextText: NEXT_LEVEL_TEXT[3],
  },
  4: { wonTitle: "", nextText: NEXT_LEVEL_TEXT[4] },
};

const titleSx = {
  mt: 10,
  textAlign: "center",
  fontWeight: "bold",
};

const subtitleSx = {
  mt: 2,
  textAlign: "center",
};

const imageMap = {
  1: "/success_screen_1.svg",
  2: "/success_screen_2.svg",
  3: "/success_screen_3.svg",
  4: "/success_screen_4.svg",
};

export default function LevelSuccessScreen({
  currentLevel,
  onContinue,
}: LevelSuccessScreenProps) {
  const [phase, setPhase] = useState<Phase>("won");
  const config = LEVEL_CONFIG[currentLevel];

  useEffect(() => {
    //manage phase transitions based on current level
    if (currentLevel === 1) {
      setPhase("next");
      return;
    }
    const id = setTimeout(() => setPhase("next"), 2000);
    return () => clearTimeout(id);
  }, [currentLevel]);

  useEffect(() => {
    if (phase !== "next") return;

    const id = setTimeout(() => {
      if (currentLevel) {
        onContinue();
      }
    }, 2000);

    return () => clearTimeout(id);
  }, [phase, currentLevel]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        px: 6,
        pt: 3,
        overflow: "hidden",
      }}
    >
      {phase === "won" && config.wonTitle && (
        <Typography variant="h6" sx={titleSx} aria-live="polite">
          {" "}
          {config.wonTitle}
        </Typography>
      )}

      {phase === "next" && (
        <>
          {config.nextTitle && (
            <Typography variant="h6" sx={titleSx} aria-live="polite">
              {" "}
              {config.nextTitle}
            </Typography>
          )}
          {config.nextText && (
            <Typography variant="subtitle1" sx={subtitleSx} aria-live="polite">
              {config.nextText}
            </Typography>
          )}
        </>
      )}

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          width: "100%",
          minHeight: 0,
          marginTop: 6,
        }}
      >
        <Box
          component="img"
          src={imageMap[currentLevel as keyof typeof imageMap]}
          alt="Maskottchen Map"
          sx={{
            width: 300,
            maxHeight: "100%",
            height: "auto",
            objectFit: "contain",
            display: "block",
          }}
        />
      </Box>
    </Box>
  );
}
