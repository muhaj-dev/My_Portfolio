// 1. Import the extendTheme function
import { extendTheme } from "@chakra-ui/react";

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  primary: "#0d6efd",
  TextColor: "color: rgb(78, 78, 78)",
  bgLight: "rgb(245, 245, 245)",
  bgDark: "rgba(0, 0, 0, 0.5)",
  light: "white"
};

export const theme = extendTheme({ colors });