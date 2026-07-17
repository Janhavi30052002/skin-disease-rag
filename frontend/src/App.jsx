import { useEffect, useMemo, useState } from "react";

import Dashboard from "./pages/Dashboard";

import ThemeContext from "./context/ThemeContext";
import { DiagnosisProvider } from "./context/DiagnosisContext";

function App() {
  const getInitialTheme = () => {
    const stored = localStorage.getItem("theme");

    if (stored) return stored;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <DiagnosisProvider>
        <Dashboard />
      </DiagnosisProvider>
    </ThemeContext.Provider>
  );
}

export default App;