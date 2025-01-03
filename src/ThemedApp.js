// MainContent.js
import React from 'react';
import { useTheme } from './ThemeContext';
import './styles.css';

const ThemedApp = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`app ${theme}`}>
      <header>
        <h1>{theme === 'light' ? 'Light Theme' : 'Dark Theme'}</h1>
        <button onClick={toggleTheme}>Toggle Theme</button>
      </header>
      <main>
        <p>This is the main content of the app!</p>
      </main>
    </div>
  );
};

export default ThemedApp;
