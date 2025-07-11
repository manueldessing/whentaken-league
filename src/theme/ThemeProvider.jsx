import { useEffect, useMemo, useState } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import { ThemeContext } from "./ThemeContext";

const lightVars = {
  "--color": "#2d3748",                    
  "--bg": "radial-gradient(ellipse 120% 90% at 30% 25%,rgb(232, 242, 249) 60%, #e3f0ff 85%,rgb(220, 238, 249) 100%)",                       
  "--a": "#4a5568",                        
  "--a-hover": "#2b6cb0",                  
  "--button-bg": "#e6ebf0",                
  "--button-border-hover": "#63b3ed",      
  "--header-border": "rgba(74, 85, 104, 0.2)",    
  "--nav-shadow": "rgba(66, 153, 225, 0.3)",      
  "--nav-shadow2": "rgba(66, 153, 225, 0.15)",   
  "--nav-border": "rgba(66, 153, 225, 0.5)",      
  "--theme-selector-bg": "rgba(226, 232, 240, 0.8)",
  "--theme-selector-bg-inner": "rgba(255, 255, 255, 0.9)", 
  "--theme-selector-system-button": "#718096",     
  "--csvtable-bg": "rgba(255, 255, 255, 0.9)",    
  "--csvtable-border": "rgba(203, 213, 224, 0.8)", 
  "--csvtable-headbg": "rgba(237, 242, 247, 0.8)", 
  "--csvtable-row-odd": "rgba(247, 250, 252, 0.8)", 
  "--link-hover-color": "#3182ce",             
      
};

const darkVars = {
  "--color": "#fff",
  "--bg": "radial-gradient( circle farthest-corner at -24.7% -47.3%,  rgb(4, 52, 65) 0%, rgb(12, 19, 41) 66.8%, rgb(8, 14, 30) 100.2% )",
  "--a": "#5e63bc",
  "--a-hover": "#535bf2",
  "--button-bg": "#093254",
  "--button-border-hover": "#62dde68e",
  "--header-border": "#989898af",
  "--nav-shadow": "#3681a3",
  "--nav-shadow2": "#3681a3",
  "--nav-border": "#62dde68e",
  "--theme-selector-bg": "rgba(128 128 128 / 0.2)",
  "--theme-selector-bg-inner": "rgba(255 255 255 / 0.2)",
  "--theme-selector-system-button": "#bc9f9f",
  "--csvtable-bg": "rgba(0, 0, 0, 0)",
  "--csvtable-border": "rgba(123, 114, 143, 0.45)",
  "--csvtable-headbg": "rgba(0, 0, 0, 0.24)",
  "--csvtable-row-odd": "rgba(129, 129, 129, 0.12)",
  "--link-hover-color": "#2bb2e3",
  "--loading-text-color": "rgba(176, 176, 176, 0.5)"
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
