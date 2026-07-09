'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import styles from './Header.module.css';
import Logo from './Logo';
import { 
  Search, Sun, Moon, Tv, Menu, X, Globe 
} from 'lucide-react';

const TwitterIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
  </svg>
);

const YoutubeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.5 12 3.5 12 3.5s-7.517 0-9.388.553a3.002 3.002 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.553 9.388.553 9.388.553s7.518 0 9.388-.553a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function Header() {
  const { theme, toggleTheme, language, toggleLanguage, mounted } = useApp();
  const [time, setTime] = useState('');
  const [trending, setTrending] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [liveTvOpen, setLiveTvOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef(null);

  // Time ticker
  useEffect(() => {
    const updateTime = () => {
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
      };
      setTime(new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'hi-IN', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  // Fetch trending items from config
  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.trending) {
          setTrending(data.trending);
        }
      })
      .catch(err => console.error("Error loading config:", err));
  }, [pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
      setSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  const navCategories = [
    { label: { en: 'India', hi: 'भारत' }, path: '/india' },
    { label: { en: 'World', hi: 'विदेश' }, path: '/world' },
    { label: { en: 'Business', hi: 'कारोबार' }, path: '/business' },
    { label: { en: 'Sports', hi: 'खेल' }, path: '/sports' },
    { label: { en: 'Entertainment', hi: 'मनोरंजन' }, path: '/entertainment' },
    { label: { en: 'Technology', hi: 'टेक' }, path: '/technology' },
    { label: { en: 'Lifestyle', hi: 'लाइफस्टाइल' }, path: '/lifestyle' },
    { label: { en: 'Opinion', hi: 'विचार' }, path: '/opinion' }
  ];

  const getTranslation = (key) => {
    const translations = {
      liveTv: { en: 'Live TV', hi: 'लाइव टीवी' },
      trending: { en: 'Trending Now', hi: 'ट्रेंडिंग खबरें' },
      login: { en: 'Login / Register', hi: 'लॉगिन / रजिस्टर' },
      hindi: { en: 'Hindi', hi: 'हिंदी' },
      english: { en: 'English', hi: 'English' },
      searchPlace: { en: 'Search news...', hi: 'खबरें खोजें...' }
    };
    return translations[key]?.[language] || '';
  };

  return (
    <header className={styles.headerContainer}>
      {/* 1. Utility Bar */}
      <div className={styles.utilityBar}>
        <div className={`container ${styles.utilityFlex}`}>
          <div className={styles.utilityLeft}>
            <span className={styles.dateTime}>{time || 'Loading Date...'}</span>
            <span className={styles.weather}>🌤️ New Delhi, 32°C</span>
          </div>
          <div className={styles.utilityRight}>
            <button className={styles.langToggleBtn} onClick={toggleLanguage}>
              <Globe size={11} style={{ marginRight: '3px', display: 'inline' }} />
              {language === 'en' ? 'हिंदी' : 'English'}
            </button>
            <div className={styles.socialIcons}>
              <a href="#" className={styles.socialIconLink} aria-label="Twitter"><TwitterIcon size={13} /></a>
              <a href="#" className={styles.socialIconLink} aria-label="Facebook"><FacebookIcon size={13} /></a>
              <a href="#" className={styles.socialIconLink} aria-label="Youtube"><YoutubeIcon size={13} /></a>
            </div>
            {/* CMS Panel link removed */}
          </div>
        </div>
      </div>

      {/* 2. Main Header Bar */}
      <div className={styles.mainHeader}>
        <div className={`container ${styles.mainHeaderFlex}`}>
          <div className={styles.logoWrapper}>
            <Link href="/">
              <Logo variant="header" height="100%" />
            </Link>
          </div>

          <div className={styles.headerActions}>
            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} className={styles.searchWrapper}>
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder={getTranslation('searchPlace')}
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className={styles.searchInput}
                style={{ opacity: searchOpen ? 1 : 0, pointerEvents: searchOpen ? 'auto' : 'none' }}
              />
              <button 
                type="button" 
                onClick={toggleSearch} 
                className={styles.searchIcon}
                aria-label="Toggle Search"
              >
                <Search size={18} />
              </button>
            </form>

            {/* Dark Mode toggle */}
            {mounted && (
              <button onClick={toggleTheme} className={styles.themeBtn} aria-label="Toggle Theme">
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
            )}

            {/* Live TV pulsing button */}
            <button className={styles.liveBtn} onClick={() => setLiveTvOpen(true)}>
              <span className="pulse-dot" style={{ backgroundColor: '#ffffff' }}></span>
              <Tv size={15} />
              <span className={styles.liveText}>{getTranslation('liveTv')}</span>
            </button>

            {/* Hamburger for mobile */}
            <button 
              className={styles.hamburgerBtn}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Navigation Bar */}
      <nav className={styles.navBar}>
        <div className={`container ${styles.navFlex}`}>
          <div className={styles.navScrollWrapper + " scrollbar-hidden"}>
            <ul className={styles.navMenu}>
              <li>
                <Link 
                  href="/" 
                  className={`${styles.navItem} ${pathname === '/' ? styles.navItemActive : ''}`}
                >
                  {language === 'en' ? 'Home' : 'होम'}
                </Link>
              </li>
              {navCategories.map((cat, idx) => {
                const isActive = pathname.startsWith(cat.path);
                return (
                  <li key={idx}>
                    <Link 
                      href={cat.path} 
                      className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                    >
                      {cat.label[language]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>

      {/* 4. Trending Ticker */}
      {trending.length > 0 && (
        <div className={styles.trendingSection}>
          <span className={styles.trendingLabel}>
            <span className="blink">🔥</span> {getTranslation('trending')}:
          </span>
          <div className={styles.trendingCarousel}>
            <div className={styles.trendingList}>
              {trending.map((item, idx) => (
                <Link key={idx} href={`/${item.category.toLowerCase()}/${item.slug}`} className={styles.trendingItem}>
                  <span className={styles.trendingDot}></span>
                  {item.title}
                </Link>
              ))}
              {/* Duplicate list for continuous infinite marquee effect */}
              {trending.map((item, idx) => (
                <Link key={`dup-${idx}`} href={`/${item.category.toLowerCase()}/${item.slug}`} className={styles.trendingItem}>
                  <span className={styles.trendingDot}></span>
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Navigation Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed', top: '102px', left: 0, right: 0, bottom: 0,
          backgroundColor: 'var(--color-card-bg)', zIndex: 98, padding: '1.5rem',
          display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--color-border)'
        }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
            <li>
              <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{ color: pathname === '/' ? 'var(--color-accent)' : 'inherit' }}>
                {language === 'en' ? 'Home' : 'होम'}
              </Link>
            </li>
            {navCategories.map((cat, idx) => (
              <li key={idx}>
                <Link 
                  href={cat.path} 
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ color: pathname.startsWith(cat.path) ? 'var(--color-accent)' : 'inherit' }}
                >
                  {cat.label[language]}
                </Link>
              </li>
            ))}
            {/* CMS Dashboard link removed */}
            <li>
              <button 
                onClick={() => { toggleLanguage(); setMobileMenuOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'none',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: 'var(--color-accent)',
                  cursor: 'pointer',
                  padding: '1rem 0',
                  width: '100%',
                  borderTop: '1px solid var(--color-border)',
                  marginTop: '0.8rem',
                  fontFamily: 'inherit'
                }}
              >
                <Globe size={18} />
                <span>{language === 'en' ? 'Switch to हिंदी' : 'English में बदलें'}</span>
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Live TV Video Modal */}
      {liveTvOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1.25rem'
        }}>
          <div style={{
            position: 'relative', width: '100%', maxWidth: '800px',
            backgroundColor: '#000000', borderRadius: '8px', overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid #333'
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.75rem 1.25rem', backgroundColor: '#111', borderBottom: '1px solid #222', color: '#fff'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                <span className="pulse-dot"></span> LIVE BROADCAST — TRUTH VELOCITY TV
              </span>
              <button 
                onClick={() => setLiveTvOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Embedded Live Video Player - Using a reliable public English news stream */}
            <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000' }}>
              <iframe
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                src="https://www.youtube.com/embed/live_stream?channel=UC5ae2D9TFB6x9hZz3nS0o3Q&autoplay=1"
                title="Truth Velocity Live News Stream"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            <div style={{ padding: '0.8rem 1.25rem', backgroundColor: '#111', color: '#888', fontSize: '0.75rem', textAlign: 'center' }}>
              Broadcasting live from regional bureaus. Powered by Truth Velocity Network.
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
