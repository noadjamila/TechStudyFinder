/*
 * SPDX-FileCopyrightText: 2026 The Tech Study Finder Contributors
 * SPDX-License-Identifier: MIT
 */

import "@mui/material/styles";
import "@mui/material/Typography";
import type * as React from "react";

declare module "@mui/material/styles" {
  interface TypeText {
    header?: string;
    subHeader?: string;
    skipButton?: string;
  }

  interface TypographyVariants {
    errorScreenTitle: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    errorScreenTitle?: React.CSSProperties;
  }

  interface Palette {
    decorative: {
      pink: string;
      green: string;
      blue: string;
      yellow: string;
      blueDark: string;
      greenDark: string;
    };
    quiz: {
      secondary: string;
      progressUnfilled: string;
    };
    navigation: {
      background: string;
      navbar: string;
    };
    favorites: {
      inactive: string;
    };
    results: {
      filterUnselected: string;
      favoriteIconToggled: string;
      favoriteIconUntoggled: string;
    };
    detailspage: {
      link: string;
    };
  }

  interface PaletteOptions {
    decorative?: {
      pink?: string;
      green?: string;
      blue?: string;
      yellow?: string;
      blueDark?: string;
      greenDark?: string;
    };
    quiz?: {
      secondary?: string;
      cardBackground?: string;
      progressUnfilled?: string;
    };
    navigation?: {
      background?: string;
      navbar?: string;
    };
    favorites?: {
      inactive?: string;
    };
    results?: {
      filterUnselected?: string;
      favoriteIconToggled?: string;
      favoriteIconUntoggled?: string;
    };
    detailspage?: {
      link?: string;
    };
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    errorScreenTitle: true;
  }
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}
