'use client';

import { useState, useEffect } from 'react';
import styles from './CookieBanner.module.css';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if consent has been recorded
    const consent = localStorage.getItem('tv-cookie-consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('tv-cookie-consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('tv-cookie-consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.banner}>
      <div className={styles.text}>
        <strong>Cookie Notification:</strong> Truth Velocity uses cookies to personalize editorial content, deliver relevant advertisements, analyze readership traffic, and verify user actions. By continuing or clicking "Accept", you agree to our cookie policies.
      </div>
      <div className={styles.actions}>
        <button onClick={handleDecline} className={`${styles.btn} ${styles.decline}`}>
          Decline
        </button>
        <button onClick={handleAccept} className={`${styles.btn} ${styles.accept}`}>
          Accept
        </button>
      </div>
    </div>
  );
}
