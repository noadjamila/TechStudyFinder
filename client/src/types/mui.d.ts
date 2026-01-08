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
      blueDark: string;
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
  declare module "*.png" {
    const content: string;
    export default content;
  }

  declare module "*.jpg" {
    const content: string;
    export default content;
  }
}
