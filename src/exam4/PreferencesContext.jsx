import { createContext, useContext, useEffect, useMemo, useState } from 'react';

// ONE context object, exported and imported everywhere
export const PreferencesContext = createContext(null);

export function PreferencesProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState(16);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  // Apply the theme to the whole page (<html data-theme="dark">)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const value = useMemo(
    () => ({ theme, fontSize, toggleTheme, setFontSize }),
    [theme, fontSize]
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

// Custom hook: returns the context or throws a clear error
export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (ctx === null) {
    throw new Error('usePreferences must be used inside a <PreferencesProvider>.');
  }
  return ctx;
}