'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './Author.module.css';
import homeStyles from '../../Home.module.css';
import AdZone from '@/components/AdZone';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AuthorProfilePage() {
  const params = useParams();
  const authorId = params.id;
  const { language } = useApp();
  
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorArticles = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/articles?authorId=${authorId}`);
        if (res.ok) {
          const data = await res.json();
          setArticles(data);
        }
      } catch (err) {
        console.error("Error fetching author articles:", err);
      } finally {
        setLoading(false);
      }
    };

    if (authorId) {
      fetchAuthorArticles();
    }
  }, [authorId]);

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div style={{ height: '180px', width: '100%', marginBottom: '2rem' }} className="skeleton" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }} className="skeleton" />
          ))}
        </div>
      </div>
    );
  }

  // Get author profile metadata from the first article, fallback if none found
  const author = articles.length > 0 ? articles[0].author : {
    name: "Staff Writer",
    designation: "Editorial Correspondent",
    bio: "Journalist covering latest breaking news.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
  };

  return (
    <div>
      {/* Profile Card Header */}
      <div className={styles.profileCard}>
        <div className="container">
          <Link href="/" style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div className={styles.profileFlex}>
            <img src={author.image} alt={author.name} className={styles.profileImg} />
            <div className={styles.profileDetails}>
              <span className={styles.authorDesignation}>{author.designation}</span>
              <h1 className={styles.authorName}>{author.name}</h1>
              <p className={styles.authorBio}>{author.bio}</p>
              <div className={styles.socialRow}>
                <a href="#" className={styles.socialBtn}>Twitter</a>
                <span style={{ opacity: 0.3 }}>|</span>
                <a href="#" className={styles.socialBtn}>Email</a>
                <span style={{ opacity: 0.3 }}>|</span>
                <a href="#" className={styles.socialBtn}>LinkedIn</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <AdZone type="leaderboard" />

        <h2 className={homeStyles.sectionHeading} style={{ marginBottom: '1.5rem' }}>
          <span>Articles By {author.name} ({articles.length})</span>
        </h2>

        {articles.length > 0 ? (
          <div className={styles.grid}>
            {articles.map((story) => (
              <Link 
                key={story.id} 
                href={`/${story.category.toLowerCase()}/${story.slug}`} 
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
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Calendar size={11} /> {formatDate(story.publishedAt)}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Clock size={11} /> {story.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            <h3>No articles published yet by this author.</h3>
          </div>
        )}
      </div>
    </div>
  );
}
