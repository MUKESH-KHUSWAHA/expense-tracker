import { createContext, useContext, useEffect, useState } from "react";

const PREF_KEYS = {
  theme: "pref_theme",
  currency: "pref_currency",
  dateFormat: "pref_dateFormat",
  language: "pref_language",
};

const defaults = {
  currency: "INR",
  dateFormat: "DD/MM/YYYY",
  language: "en",
};

const PreferencesContext = createContext(null);

export const PreferencesProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const v = localStorage.getItem(PREF_KEYS.theme);
    if (v === "dark" || v === "light") return v;
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode !== null) return darkMode === "true" ? "dark" : "light";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });
  const [currency, setCurrency] = useState(() => {
    const v = localStorage.getItem(PREF_KEYS.currency);
    return v || defaults.currency;
  });
  const [dateFormat, setDateFormat] = useState(() => {
    const v = localStorage.getItem(PREF_KEYS.dateFormat);
    return v || defaults.dateFormat;
  });
  const [language, setLanguage] = useState(() => {
    const v = localStorage.getItem(PREF_KEYS.language);
    return v || defaults.language;
  });

  useEffect(() => {
    const isDark = theme === "dark";
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(PREF_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(PREF_KEYS.currency, currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem(PREF_KEYS.dateFormat, dateFormat);
  }, [dateFormat]);

  useEffect(() => {
    localStorage.setItem(PREF_KEYS.language, language);
  }, [language]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <PreferencesContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        currency,
        setCurrency,
        dateFormat,
        setDateFormat,
        language,
        setLanguage,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
};
