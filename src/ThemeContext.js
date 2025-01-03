// ThemeContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.className = theme; // Apply the theme class to <body>
  }, [theme]);

  const toggleTheme = () => {
    console.log("Toggling theme...");
    setTheme((prevTheme) => {
        const newTheme = prevTheme === "light" ? "dark" : "light";
        console.log("New theme:", newTheme); // Log new theme
        return newTheme;});
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
