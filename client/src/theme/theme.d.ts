import "@mui/material/styles";
import "@mui/material/Typography";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    errorScreenTitle: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    errorScreenTitle?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    errorScreenTitle: true;
  }
}
