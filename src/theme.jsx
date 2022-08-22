// 1. Import the extendTheme function
import { extendTheme } from "@chakra-ui/react";

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  primary: "#8027F4",
  primaryLight: "#D9BBFF",
  secondary: "#F39DFF",
  dark: "#444444",
//   darkAlt: "#777777",
//   light: "#FFFFFF",
//   lightAlt: "#CCCCCC",
//   error: "#E82B2B",
//   info: "#22A0EB",
//   success: "#01A666",
//   black: "#000000",
//   bg: "#D9D9D9",

};

export const theme = extendTheme({ colors });
