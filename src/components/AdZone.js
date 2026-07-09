'use client';

import { useEffect, useState } from 'react';
import styles from './AdZone.module.css';

export default function AdZone({ type }) {
  const [adsConfig, setAdsConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.ads) {
          setAdsConfig(data.ads);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading ads configuration:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !adsConfig || !adsConfig[type]) return null;

  const getAdDetails = () => {
    switch (type) {
      case 'leaderboard':
        return {
          boxClass: `${styles.adBox} ${styles.leaderboard}`,
          title: 'TRUTH VELOCITY ADVERTISING',
          subtitle: 'Reach millions of daily readers. Email ads@truthvelocity.com to feature your brand here.'
        };
      case 'sidebar_rect':
        return {
          boxClass: `${styles.adBox} ${styles.sidebar_rect}`,
          title: 'SPONSOR CONTENT',
          subtitle: 'Grow your business with premium editorial ad placements. Contact our sales department today.'
        };
      case 'mid_article':
        return {
          boxClass: `${styles.adBox} ${styles.mid_article}`,
          title: 'ADVERTISEMENT',
          subtitle: 'Support independent journalism. Get a ad-free reading experience by subscribing to Truth Velocity Premium.'
        };
      default:
        return null;
    }
  };

  const ad = getAdDetails();
  if (!ad) return null;

  return (
    <div className={styles.adContainer}>
      <span className={styles.adLabel}>Advertisement</span>
      <div className={ad.boxClass}>
        <span className={styles.adTitle}>{ad.title}</span>
        <span className={styles.adSubtitle}>{ad.subtitle}</span>
      </div>
    </div>
  );
}
