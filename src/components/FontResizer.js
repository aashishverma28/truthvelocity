'use client';

import { useState } from 'react';
import styles from './FontResizer.module.css';

export default function FontResizer({ onSizeChange }) {
  const [activeSize, setActiveSize] = useState('medium'); // small, medium, large

  const handleSizeClick = (size) => {
    setActiveSize(size);
    if (onSizeChange) {
      onSizeChange(size);
    }
  };

  return (
    <div className={styles.resizerContainer}>
      <span className={styles.resizerLabel}>Text Size:</span>
      <button 
        onClick={() => handleSizeClick('small')}
        className={`${styles.resizerBtn} ${activeSize === 'small' ? styles.resizerBtnActive : ''}`}
        title="Decrease font size"
      >
        A-
      </button>
      <button 
        onClick={() => handleSizeClick('medium')}
        className={`${styles.resizerBtn} ${activeSize === 'medium' ? styles.resizerBtnActive : ''}`}
        title="Default font size"
      >
        A
      </button>
      <button 
        onClick={() => handleSizeClick('large')}
        className={`${styles.resizerBtn} ${activeSize === 'large' ? styles.resizerBtnActive : ''}`}
        title="Increase font size"
      >
        A+
      </button>
    </div>
  );
}
