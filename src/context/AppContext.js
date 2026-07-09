'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [bookmarks, setBookmarks] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Initial load from localStorage
    const savedTheme = localStorage.getItem('tv-theme') || 'light';
    const savedLang = localStorage.getItem('tv-lang') || 'en';
    const savedBookmarks = JSON.parse(localStorage.getItem('tv-bookmarks') || '[]');
    
    setTheme(savedTheme);
    setLanguage(savedLang);
    setBookmarks(savedBookmarks);
    
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('tv-theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
    localStorage.setItem('tv-lang', nextLang);
  };

  const toggleBookmark = (articleId) => {
    let nextBookmarks;
    if (bookmarks.includes(articleId)) {
      nextBookmarks = bookmarks.filter(id => id !== articleId);
    } else {
      nextBookmarks = [...bookmarks, articleId];
    }
    setBookmarks(nextBookmarks);
    localStorage.setItem('tv-bookmarks', JSON.stringify(nextBookmarks));
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, language, toggleLanguage, bookmarks, toggleBookmark, mounted }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
