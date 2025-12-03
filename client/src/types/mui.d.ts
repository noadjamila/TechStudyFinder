import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    quiz: {
      buttonColor: string;
      buttonChecked: string;
      cardBackground: string;
      textColor: string;
    };
  }

  interface PaletteOptions {
    quiz?: {
      buttonColor?: string;
      buttonChecked?: string;
      cardBackground?: string;
      textColor?: string;
    };
  }
}
