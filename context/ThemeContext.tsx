import React, { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

type AppTheme = "light" | "dark" | "system";

type ThemeContextValue = {
  scheme: "light" | "dark";
  mode: AppTheme;
  setMode: (mode: AppTheme) => void;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [mode, setMode] = useState<AppTheme>("system");

  const scheme: "light" | "dark" =
    mode === "system" ? (systemScheme === "dark" ? "dark" : "light") : mode;

  const value = useMemo<ThemeContextValue>(
    () => ({
      scheme,
      mode,
      setMode,
      toggleMode: () => setMode((prev) => (prev === "dark" ? "light" : "dark")),
    }),
    [mode, scheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useAppTheme must be used inside AppThemeProvider");
  return context;
}
