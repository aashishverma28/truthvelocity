'use client';

import { useEffect, useState, use } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import styles from './Category.module.css';
import homeStyles from '../Home.module.css';
import AdZone from '@/components/AdZone';
import { Clock } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const { language } = useApp();
  const categoryName = params.category;
  
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  useEffect(() => {
    const fetchCategoryArticles = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/articles?category=${categoryName}`);
        if (res.ok) {
          const data = await res.json();
          setArticles(data);
        } else {
          setArticles([]);
        }
      } catch (err) {
        console.error("Error loading category articles:", err);
      } finally {
        setLoading(false);
      }
    };
    if (categoryName) {
      fetchCategoryArticles();
    }
  }, [categoryName]);

  // Handle sorting
  const sortedArticles = [...articles].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    } else if (sortBy === 'oldest') {
      return new Date(a.publishedAt) - new Date(b.publishedAt);
    }
    return 0;
  });

  // Handle pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = sortedArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const getRelativeTime = (isoString) => {
    const diffMs = new Date() - new Date(isoString);
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 1) return language === 'en' ? 'Just now' : 'अभी-अभी';
    if (diffHrs < 24) return `${diffHrs} ${language === 'en' ? 'hours ago' : 'घंटे पहले'}`;
    return language === 'en' ? 'Yesterday' : 'कल';
  };

  const getBannerStyle = () => {
    const bgColors = {
      sports: '#15803d',
      business: '#1e3a8a',
      entertainment: '#7e22ce',
      technology: '#0f766e',
      lifestyle: '#b45309',
      opinion: '#4b5563',
      india: '#0b1f3a',
      world: '#2b5c8f'
    };
    return {
      backgroundColor: bgColors[categoryName?.toLowerCase()] || 'var(--color-primary)'
    };
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div style={{ height: '180px', width: '100%', marginBottom: '2rem' }} className="skeleton" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ height: '180px' }} className="skeleton" />
              <div style={{ height: '30px' }} className="skeleton" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Category Hero Banner */}
      <div className={styles.banner} style={getBannerStyle()}>
        <div className="container">
          <h1 className={styles.bannerTitle}>
            {language === 'hi' && categoryName?.toLowerCase() === 'india' ? 'भारत' : categoryName}
          </h1>
        </div>
      </div>

      <div className="container">
        {/* Top Ad */}
        <AdZone type="leaderboard" />

        {/* Filters/Sort bar */}
        <div className={styles.filterRow}>
          <span className={styles.resultCount}>
            {articles.length} {language === 'en' ? 'Articles found' : 'लेख मिले'}
          </span>
          <div>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)} 
              className={styles.sortDropdown}
            >
              <option value="latest">{language === 'en' ? 'Latest First' : 'नवीनतम पहले'}</option>
              <option value="oldest">{language === 'en' ? 'Oldest First' : 'पुराने पहले'}</option>
            </select>
          </div>
        </div>

        {/* Articles Grid */}
        {currentArticles.length > 0 ? (
          <div className={styles.grid}>
            {currentArticles.map((story) => (
              <Link 
                key={story.id} 
                href={`/${categoryName.toLowerCase()}/${story.slug}`} 
                className={homeStyles.storyCard}
              >
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
                    <span>{getRelativeTime(story.publishedAt)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Clock size={11} /> {story.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
            <h3>{language === 'en' ? 'No articles found in this category.' : 'इस श्रेणी में कोई लेख नहीं मिला।'}</h3>
            <p style={{ marginTop: '0.5rem' }}>{language === 'en' ? 'Check back later or explore other sections.' : 'कृपया बाद में देखें या अन्य अनुभागों को खोजें।'}</p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`${styles.pageBtn} ${currentPage === 1 ? styles.disabledBtn : ''}`}
            >
              {language === 'en' ? 'Previous' : 'पिछला'}
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.activePageBtn : ''}`}
              >
                {i + 1}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`${styles.pageBtn} ${currentPage === totalPages ? styles.disabledBtn : ''}`}
            >
              {language === 'en' ? 'Next' : 'अगला'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
