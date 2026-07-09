'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './MobileBottomNav.module.css';
import { Home, Search, Bookmark } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { language } = useApp();

  const getLabel = (key) => {
    const labels = {
      home: { en: 'Home', hi: 'होम' },
      search: { en: 'Search', hi: 'खोजें' },
      saved: { en: 'Saved', hi: 'बुकमार्क' },
      // admin labels removed
    };
    return labels[key]?.[language] || '';
  };

  return (
    <div className={styles.bottomNav}>
      <Link 
        href="/" 
        className={`${styles.navItem} ${pathname === '/' ? styles.navItemActive : ''}`}
      >
        <Home size={18} />
        <span>{getLabel('home')}</span>
      </Link>
      
      <Link 
        href="/search" 
        className={`${styles.navItem} ${pathname === '/search' ? styles.navItemActive : ''}`}
      >
        <Search size={18} />
        <span>{getLabel('search')}</span>
      </Link>
      
      <Link 
        href="/saved" 
        className={`${styles.navItem} ${pathname === '/saved' ? styles.navItemActive : ''}`}
      >
        <Bookmark size={18} />
        <span>{getLabel('saved')}</span>
      </Link>
      
      {/* Mobile CMS link removed */}
    </div>
  );
}
