import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeText {
    header?: string;
    subHeader?: string;
    skipButton?: string;
  }

  interface Palette {
    decorative: {
      pink: string;
      green: string;
      blue: string;
      yellow: string;
    };
    quiz: {
      secondary: string;
      progressUnfilled: string;
    };
    navigation: {
      background: string;
    };
    favorites: {
      inactive: string;
    };
    results: {
      background: string;
      filterBorder: string;
      filterSelected: string;
      filterUnselected: string;
      hoverBackground: string;
      favoriteIconToggled: string;
      favoriteIconUntoggled: string;
    };
  }

  interface PaletteOptions {
    decorative?: {
      pink?: string;
      green?: string;
      blue?: string;
      yellow?: string;
    };
    quiz?: {
      secondary?: string;
      cardBackground?: string;
      progressUnfilled?: string;
    };
    navigation?: {
      background?: string;
    };
    favorites?: {
      inactive?: string;
    };
    results?: {
      background?: string;
      filterBorder?: string;
      filterSelected?: string;
      filterUnselected?: string;
      hoverBackground?: string;
      favoriteIconToggled?: string;
      favoriteIconUntoggled?: string;
    };
  }
}
