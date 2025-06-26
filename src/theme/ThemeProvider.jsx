import { useEffect, useMemo, useState } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import { ThemeContext } from "./ThemeContext";

const lightVars = {
  "--color": "#03111e",
  "--bg": "#c8abdb",
  "--a": "#191d6e",
  "--a-hover": "#343aaf",
  "--button-bg": "#8173a7",
  "--button-border-hover": "#0e125a8a",
  "--header-border": "#363535af",
  "--nav-shadow": "#12152f95",
  "--nav-shadow2": "#31387e63",
  "--nav-border": "#30378495",
  "--theme-selector-bg": "rgba(144, 144, 144, 0.52)",
  "--theme-selector-bg-inner": "rgba(255 255 255 / 0.2)",
  "--theme-selector-system-button": "#8f6d6d",
  "--csvtable-bg": "rgba(255,255,255,0.15)",
  "--csvtable-border": "rgba(123, 114, 143, 0.45)",
  "--csvtable-headbg": "rgba(0,0,0,0.10)",
  "--csvtable-row-odd": "rgba(55, 55, 55, 0.16)",
  "--link-hover-color": "#551b85",
};

const darkVars = {
  "--color": "#fff",
  "--bg": "#29223c",
  "--a": "#5e63bc",
  "--a-hover": "#535bf2",
  "--button-bg": "#423763",
  "--button-border-hover": "#62dde68e",
  "--header-border": "#989898af",
  "--nav-shadow": "#62c7e695",
  "--nav-shadow2": "#62c5e658",
  "--nav-border": "#62dde68e",
  "--theme-selector-bg": "rgba(128 128 128 / 0.2)",
  "--theme-selector-bg-inner": "rgba(255 255 255 / 0.2)",
  "--theme-selector-system-button": "#bc9f9f",
  "--csvtable-bg": "rgba(0, 0, 0, 0)",
  "--csvtable-border": "rgba(123, 114, 143, 0.45)",
  "--csvtable-headbg": "rgba(0, 0, 0, 0.24)",
  "--csvtable-row-odd": "rgba(129, 129, 129, 0.12)",
  "--link-hover-color": "#a24aea",
};

function setCSSVars(vars) {
  for (const [k, v] of Object.entries(vars)) {
    document.documentElement.style.setProperty(k, v);
  }
}

function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

export default function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored || "system";
  });

  useEffect(() => {
    let effective = theme;
    if (theme === "system") {
      effective = getSystemTheme();
    }
    setCSSVars(effective === "light" ? lightVars : darkVars);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = () => {
      setCSSVars(mq.matches ? lightVars : darkVars);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  const muiTheme = useMemo(() => createTheme({
    palette: {
      mode: theme === "system" ? getSystemTheme() : theme,
      ...(theme === "light" || (theme === "system" && getSystemTheme() === "light")
        ? {
            background: { default: lightVars["--bg"] },
            text: { primary: lightVars["--color"] },
            primary: { main: "#191d6e" },
          }
        : {
            background: { default: darkVars["--bg"] },
            text: { primary: darkVars["--color"] },
            primary: { main: "#5e63bc" },
          }),
    },
    typography: {
      fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
    },
  }), [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <MuiThemeProvider theme={muiTheme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
