// 1. Import the extendTheme function
import { extendTheme } from "@chakra-ui/react";

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  primary: "#8027F4",
  primaryLight: "#D9BBFF",
  secondary: "#F39DFF",
};

export const theme = extendTheme({ colors });
