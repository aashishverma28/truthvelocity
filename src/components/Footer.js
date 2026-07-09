'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { Mail } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Logo from './Logo';

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

const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

export default function Footer() {
  const { language } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const getTranslation = (key) => {
    const translations = {
      tagline: { 
        en: 'News That Moves Fast. Facts That Stay True. Delivering verified news, in-depth investigations, and global coverage.', 
        hi: 'खबरें जो चलें तेज, तथ्य जो रहें सच्चे। प्रमाणित समाचार, गहन जांच और वैश्विक कवरेज प्रदान करना।' 
      },
      categories: { en: 'Categories', hi: 'श्रेणियां' },
      company: { en: 'Company', hi: 'कंपनी' },
      newsletter: { en: 'Newsletter', hi: 'न्यूज़लेटर' },
      newsDesc: { 
        en: 'Subscribe to receive breaking news alerts and hand-picked daily editorial picks directly in your inbox.', 
        hi: 'सीधे अपने इनबॉक्स में ब्रेकिंग न्यूज़ अलर्ट और चुनिंदा दैनिक संपादकीय प्राप्त करने के लिए सदस्यता लें।' 
      },
      subscribe: { en: 'Subscribe', hi: 'सदस्यता लें' },
      subscribedMsg: { en: 'Thank you for subscribing!', hi: 'सदस्यता लेने के लिए धन्यवाद!' },
      placeholder: { en: 'Your email address', hi: 'आपका ईमेल पता' }
    };
    return translations[key]?.[language] || '';
  };

  const categories = [
    { label: { en: 'India', hi: 'भारत' }, path: '/india' },
    { label: { en: 'World', hi: 'विदेश' }, path: '/world' },
    { label: { en: 'Business', hi: 'कारोबार' }, path: '/business' },
    { label: { en: 'Sports', hi: 'खेल' }, path: '/sports' },
    { label: { en: 'Entertainment', hi: 'मनोरंजन' }, path: '/entertainment' },
    { label: { en: 'Technology', hi: 'टेक' }, path: '/technology' },
    { label: { en: 'Lifestyle', hi: 'लाइफस्टाइल' }, path: '/lifestyle' },
    { label: { en: 'Opinion', hi: 'विचार' }, path: '/opinion' }
  ];

  return (
    <footer className={styles.footerContainer}>
      <div className="container">
        <div className={styles.footerGrid}>
          {/* Brand Column */}
          <div className={styles.brandCol}>
            <div style={{ marginBottom: '0.5rem', marginLeft: '-15px' }}>
              <Logo variant="dark" height="45px" />
            </div>
            <p className={styles.tagline}>{getTranslation('tagline')}</p>
            <div className={styles.socialIcons}>
              <a href="#" className={styles.socialLink} aria-label="Twitter"><TwitterIcon size={16} /></a>
              <a href="#" className={styles.socialLink} aria-label="Facebook"><FacebookIcon size={16} /></a>
              <a href="#" className={styles.socialLink} aria-label="Youtube"><YoutubeIcon size={16} /></a>
              <a href="#" className={styles.socialLink} aria-label="Instagram"><InstagramIcon size={16} /></a>
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className={styles.colTitle}>{getTranslation('categories')}</h3>
            <ul className={styles.linkList}>
              {categories.slice(0, 8).map((cat, idx) => (
                <li key={idx} className={styles.linkItem}>
                  <Link href={cat.path}>{cat.label[language]}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className={styles.colTitle}>{getTranslation('company')}</h3>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}><Link href="/about">About Us</Link></li>
              <li className={styles.linkItem}><Link href="/contact">Contact Us</Link></li>
              <li className={styles.linkItem}><Link href="/careers">Careers</Link></li>
              <li className={styles.linkItem}><Link href="/press">Press Room</Link></li>
              <li className={styles.linkItem}><Link href="/advertise">Advertise With Us</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className={styles.colTitle}>{getTranslation('newsletter')}</h3>
            <p className={styles.newsletterDesc}>{getTranslation('newsDesc')}</p>
            {subscribed ? (
              <div style={{ color: 'var(--color-secondary-accent)', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={16} />
                {getTranslation('subscribedMsg')}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
                <input 
                  type="email" 
                  required
                  placeholder={getTranslation('placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.emailInput}
                />
                <button type="submit" className={styles.submitBtn}>
                  {getTranslation('subscribe')}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className={styles.copyrightRow}>
          <div>
            © {new Date().getFullYear()} Truth Velocity Media Group. All rights reserved.
          </div>
          <div className={styles.legalLinks}>
            <Link href="/privacy" className={styles.legalLink}>Privacy Policy</Link>
            <Link href="/terms" className={styles.legalLink}>Terms of Service</Link>
            <Link href="/cookie" className={styles.legalLink}>Cookie Policy</Link>
            <Link href="/sitemap" className={styles.legalLink}>Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
