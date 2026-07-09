'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import homeStyles from '../Home.module.css';
import styles from './Saved.module.css';
import { Clock, Bookmark, Trash2, ArrowLeft } from 'lucide-react';

export default function SavedArticlesPage() {
  const { bookmarks, toggleBookmark, language } = useApp();
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/articles');
        if (res.ok) {
          const data = await res.json();
          // Filter articles that are in the bookmarks list
          const filtered = data.filter(art => bookmarks.includes(art.id));
          setSavedArticles(filtered);
        }
      } catch (err) {
        console.error("Error loading saved articles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [bookmarks]);

  const getTranslation = (key) => {
    const labels = {
      savedTitle: { en: 'Saved Articles', hi: 'बुकमार्क की गई खबरें' },
      savedDesc: { en: 'Your personal reading list. Saved articles are persisted in your browser.', hi: 'आपकी व्यक्तिगत पठन सूची। सहेजे गए लेख आपके ब्राउज़र में सुरक्षित हैं।' },
      noSaved: { en: 'No saved articles yet.', hi: 'अभी तक कोई खबर बुकमार्क नहीं की गई है।' },
      noSavedDesc: { en: 'Bookmark articles by clicking the bookmark flag on any article detail page.', hi: 'किसी भी लेख के विवरण पृष्ठ पर बुकमार्क ध्वज पर क्लिक करके लेखों को सहेजें।' },
      backHome: { en: 'Back to Homepage', hi: 'मुख्य पृष्ठ पर जाएँ' },
      unsave: { en: 'Unsave', hi: 'हटाएं' }
    };
    return labels[key]?.[language] || '';
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div style={{ height: '30px', width: '30%', marginBottom: '1.5rem' }} className="skeleton" />
        <div className={styles.grid}>
          {[1, 2].map(n => (
            <div key={n} style={{ height: '220px' }} className="skeleton" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Link href="/" style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
        <ArrowLeft size={14} /> Back to Home
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          {getTranslation('savedTitle')}
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          {getTranslation('savedDesc')}
        </p>
      </div>

      {savedArticles.length > 0 ? (
        <div className={styles.grid}>
          {savedArticles.map((story) => (
            <div 
              key={story.id} 
              className={homeStyles.storyCard}
              style={{ position: 'relative' }}
            >
              {/* Unsave button floating */}
              <button
                onClick={() => toggleBookmark(story.id)}
                style={{
                  position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 10,
                  backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none',
                  width: '32px', height: '32px', borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                title={getTranslation('unsave')}
              >
                <Trash2 size={15} />
              </button>

              <Link href={`/${story.category.toLowerCase()}/${story.slug}`}>
                <div className={homeStyles.storyImgWrapper}>
                  <img src={story.image} alt={story.title} className={homeStyles.storyImg} />
                </div>
                <div className={homeStyles.storyContent}>
                  <span className={`badge badge-${story.category.toLowerCase()} ${homeStyles.cardTag}`}>
                    {story.category}
                  </span>
                  <h3 className={homeStyles.storyTitle}>{story.title}</h3>
                  <p className={homeStyles.storyExcerpt}>{story.excerpt}</p>
                  <div className={homeStyles.storyMeta} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Clock size={11} /> {story.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 0', border: '1px dashed var(--color-border-dark)', borderRadius: '8px' }}>
          <Bookmark size={40} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{getTranslation('noSaved')}</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.5rem', marginBottom: '1.5rem', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
            {getTranslation('noSavedDesc')}
          </p>
          <Link href="/" className={homeStyles.widgetBtn} style={{ padding: '0.6rem 1.5rem', borderRadius: '4px', textDecoration: 'none', display: 'inline-block' }}>
            {getTranslation('backHome')}
          </Link>
        </div>
      )}
    </div>
  );
}
