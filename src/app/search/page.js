'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './search.module.css';
import { Search, Clock, Calendar } from 'lucide-react';
import AdZone from '@/components/AdZone';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    setSearchInput(query);
    if (!query) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/articles?search=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
      setActiveCategory('All');
    }
  };

  // Filter categories
  const categories = ['All', ...new Set(results.map(r => r.category))];

  const filteredResults = activeCategory === 'All' 
    ? results 
    : results.filter(r => r.category === activeCategory);

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      {/* Search Header Banner */}
      <div className={styles.searchHeader}>
        <div className="container">
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <input 
              type="text" 
              placeholder="Search articles, topics, keywords..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchBtn}>
              <Search size={16} /> Search
            </button>
          </form>
        </div>
      </div>

      <div className="container">
        <AdZone type="leaderboard" />

        {query && (
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)' }}>
              {loading 
                ? 'Searching...' 
                : `${results.length} result${results.length === 1 ? '' : 's'} found for "${query}"`
              }
            </h2>
          </div>
        )}

        {/* Category Pills Filters */}
        {results.length > 0 && (
          <div className={styles.filterPanel}>
            <span className={styles.filterLabel}>Filter By:</span>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`${styles.filterPill} ${activeCategory === cat ? styles.filterPillActive : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className={styles.resultsList}>
            {[1, 2].map(n => (
              <div key={n} style={{ height: '150px', width: '100%' }} className="skeleton" />
            ))}
          </div>
        ) : filteredResults.length > 0 ? (
          <div className={styles.resultsList}>
            {filteredResults.map((item) => (
              <Link 
                key={item.id} 
                href={`/${item.category.toLowerCase()}/${item.slug}`} 
                className={styles.resultCard}
              >
                <div className={styles.resultImgWrapper}>
                  <img src={item.image} alt={item.title} className={styles.resultImg} />
                </div>
                <div className={styles.resultDetails}>
                  <div>
                    <span className={`badge badge-${item.category.toLowerCase()}`} style={{ marginBottom: '0.4rem' }}>
                      {item.category}
                    </span>
                    <h3 className={styles.resultTitle}>{item.title}</h3>
                    <p className={styles.resultExcerpt}>{item.excerpt}</p>
                  </div>
                  <div className={styles.resultMeta}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Calendar size={11} /> {formatDate(item.publishedAt)}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Clock size={11} /> {item.readTime}
                    </span>
                    <span>By {item.author.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          query && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
              <h3>No results found</h3>
              <p style={{ marginTop: '0.5rem' }}>Try checking your spelling, using different keywords, or exploring categories.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Loading Search Panel...</h2>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
