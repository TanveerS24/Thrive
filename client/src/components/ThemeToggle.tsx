import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-xl transition-colors ${
        theme === 'light'
          ? 'bg-background-light text-text-light hover:bg-gray-200'
          : 'bg-gray-700 text-text-dark hover:bg-gray-600'
      }`}
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          {/* Moon icon */}
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          {/* Sun icon */}
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-2.121-2.121a4 4 0 00-5.656 0l2.121 2.121a4 4 0 005.656 0zM15.546 5.546a1 1 0 011.414 0l1.414 1.414a1 1 0 11-1.414 1.414l-1.414-1.414a1 1 0 010-1.414zM9 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm6 9a1 1 0 101 0 1 1 0 00-1 0zm-8 6a1 1 0 101 0 1 1 0 00-1 0zm0-6a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
