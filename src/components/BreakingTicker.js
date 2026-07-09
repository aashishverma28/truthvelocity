'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import styles from './BreakingTicker.module.css';

export default function BreakingTicker() {
  const { language } = useApp();
  const [items, setItems] = useState([]);

  // Fetch breaking news from configuration API
  useEffect(() => {
    const fetchBreaking = () => {
      fetch('/api/config')
        .then(res => res.json())
        .then(data => {
          if (data.breakingNews) {
            setItems(data.breakingNews);
          }
        })
        .catch(err => console.error("Error loading breaking ticker:", err));
    };

    fetchBreaking();
    // Refresh breaking ticker configuration every 10 seconds to respond to CMS updates immediately
    const interval = setInterval(fetchBreaking, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredItems = items.filter(item => item.lang === language);

  if (filteredItems.length === 0) return null;

  const getLabel = () => {
    return language === 'en' ? 'BREAKING' : 'ब्रेकिंग न्यूज़';
  };

  return (
    <div className={styles.tickerContainer}>
      <div className={styles.tickerLabel}>
        <span className="blink">{getLabel()}</span>
      </div>
      <div className={styles.tickerBody}>
        <div className={styles.tickerList}>
          {filteredItems.map((item, idx) => (
            <span key={item.id || idx} className={styles.tickerItem}>
              <span className={styles.tickerDivider}>✦</span>
              {item.title}
            </span>
          ))}
          {/* Duplicate list for continuous scrolling marquee */}
          {filteredItems.map((item, idx) => (
            <span key={`dup-${item.id || idx}`} className={styles.tickerItem}>
              <span className={styles.tickerDivider}>✦</span>
              {item.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
