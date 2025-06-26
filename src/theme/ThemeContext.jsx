import { createContext, useContext } from "react";

export const ThemeContext = createContext({
  theme: "system",
  setTheme: () => {},
});

export function useThemeContext() {
  return useContext(ThemeContext);
}
