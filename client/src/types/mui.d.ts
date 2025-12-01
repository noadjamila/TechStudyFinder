import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeText {
    header?: string;
  }

  interface Palette {
    quiz: {
      buttonColor: string;
      buttonChecked: string;
      cardBackground: string;
      textColor: string;
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
    quiz?: {
      buttonColor?: string;
      buttonChecked?: string;
      cardBackground?: string;
      textColor?: string;
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
