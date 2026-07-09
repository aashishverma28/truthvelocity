'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import styles from './Article.module.css';
import homeStyles from '../../Home.module.css';
import FontResizer from '@/components/FontResizer';
import AdZone from '@/components/AdZone';
import { 
  Bookmark, Share2, Link as LinkIcon, 
  MessageSquare, Calendar, Clock, ChevronRight, User 
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

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language, bookmarks, toggleBookmark } = useApp();
  
  const { category, slug } = params;
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Font Size class
  const [fontSize, setFontSize] = useState('medium'); // small, medium, large

  // Comment Form States
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [commentError, setCommentError] = useState('');

  // Copy Link State
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchArticleData = async () => {
      setLoading(true);
      setError(false);
      try {
        // Fetch current article
        const res = await fetch(`/api/articles?slug=${slug}`);
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setArticle(data);

        // Fetch related articles
        const relRes = await fetch(`/api/articles?category=${data.category}`);
        if (relRes.ok) {
          const relData = await relRes.json();
          // Filter out current article and slice to 3
          setRelated(relData.filter(a => a.id !== data.id).slice(0, 3));
        }

        // Fetch trending articles
        const configRes = await fetch('/api/config');
        if (configRes.ok) {
          const configData = await configRes.json();
          setTrending(configData.trending);
        }
      } catch (err) {
        console.error("Error loading article details:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticleData();
    }
  }, [slug]);

  const handleBookmarkToggle = () => {
    if (article) {
      toggleBookmark(article.id);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: article.id,
          name: commentName,
          text: commentText
        })
      });

      if (res.ok) {
        const newComment = await res.json();
        // Update local article comments state
        setArticle(prev => ({
          ...prev,
          comments: [...(prev.comments || []), newComment]
        }));
        setCommentName('');
        setCommentText('');
        setCommentSuccess(true);
        setTimeout(() => setCommentSuccess(false), 3000);
      } else {
        setCommentError('Error submitting comment');
      }
    } catch (err) {
      console.error(err);
      setCommentError('Network error');
    }
  };

  const formatDate = (isoString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(isoString).toLocaleDateString(language === 'en' ? 'en-US' : 'hi-IN', options);
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div style={{ height: '30px', width: '30%', marginBottom: '1rem' }} className="skeleton" />
        <div style={{ height: '60px', width: '80%', marginBottom: '1.5rem' }} className="skeleton" />
        <div style={{ height: '350px', width: '100%', marginBottom: '2rem' }} className="skeleton" />
        <div style={{ height: '200px' }} className="skeleton" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <h2>Article Not Found</h2>
        <p style={{ margin: '1rem 0' }}>The article you are looking for does not exist or has been removed.</p>
        <Link href="/" className={styles.formBtn} style={{ padding: '0.6rem 1.5rem', display: 'inline-block' }}>
          Back to Homepage
        </Link>
      </div>
    );
  }

  const isBookmarked = bookmarks.includes(article.id);

  return (
    <article className="container">
      {/* Breadcrumbs */}
      <div className={styles.breadcrumbs}>
        <Link href="/">Home</Link>
        <ChevronRight size={11} className={styles.breadcrumbSeparator} />
        <Link href={`/${article.category.toLowerCase()}`}>{article.category}</Link>
        {article.subCategory && (
          <>
            <ChevronRight size={11} className={styles.breadcrumbSeparator} />
            <span style={{ color: 'var(--color-accent)' }}>{article.subCategory}</span>
          </>
        )}
      </div>

      {/* Category Tag & Headline */}
      <span className={`badge badge-${article.category.toLowerCase()} ${styles.categoryTag}`}>
        {article.category}
      </span>
      <h1 className={styles.headline}>{article.title}</h1>

      {/* Byline / Author information */}
      <div className={styles.bylineRow}>
        <div className={styles.authorLink}>
          <Link href={`/author/${article.author.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <img src={article.author.image} alt={article.author.name} className={styles.authorImg} />
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>{article.author.name}</span>
              <span className={styles.authorRole}>{article.author.designation}</span>
            </div>
          </Link>
        </div>
        
        {/* Right Info: Font resizer and Dates */}
        <div className={styles.metaWrapper}>
          <FontResizer onSizeChange={(size) => setFontSize(size)} />
          <div className={styles.publishMeta}>
            <div>Published: {formatDate(article.publishedAt)}</div>
            {article.updatedAt !== article.publishedAt && (
              <div>Updated: {formatDate(article.updatedAt)}</div>
            )}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}>
              <Clock size={11} /> {article.readTime}
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className={styles.detailGrid}>
        
        {/* Main Content Column */}
        <div className={styles.mainContent}>
          {/* Sticky Left Share bar */}
          <div className={styles.shareBarWrapper}>
            <div className={styles.shareBar}>
              <button 
                className={styles.shareBtn} 
                onClick={handleBookmarkToggle} 
                title={isBookmarked ? "Remove Bookmark" : "Save for Later"}
                style={{ color: isBookmarked ? 'var(--color-accent)' : 'inherit' }}
              >
                <Bookmark size={16} fill={isBookmarked ? 'var(--color-accent)' : 'none'} />
              </button>
              <button 
                className={styles.shareBtn} 
                onClick={handleCopyLink}
                title="Copy Article Link"
              >
                <LinkIcon size={16} />
              </button>
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noreferrer"
                className={styles.shareBtn} 
                title="Share on Twitter/X"
              >
                <TwitterIcon size={14} />
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                target="_blank"
                rel="noreferrer"
                className={styles.shareBtn} 
                title="Share on Facebook"
              >
                <FacebookIcon size={14} />
              </a>
            </div>
          </div>

          {/* Featured Image */}
          <div className={styles.featuredImageWrapper}>
            <img src={article.image} alt={article.title} className={styles.featuredImage} />
            <div className={styles.imageCaption}>
              Representative file photo: Editorial coverage of {article.title}. (Photo: Truth Velocity Service)
            </div>
          </div>

          {/* Article Body */}
          <div className={`${styles.articleBody} ${styles['font_' + fontSize]}`} dangerouslySetInnerHTML={{ __html: article.content }} />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className={styles.tagsRow}>
              {article.tags.map((tag, idx) => (
                <Link key={idx} href={`/search?q=${encodeURIComponent(tag)}`} className={styles.tagPill}>
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Author Bio Box */}
          <div className={styles.authorBioBox}>
            <img src={article.author.image} alt={article.author.name} className={styles.bioImg} />
            <div className={styles.bioDetails}>
              <div className={styles.bioName}>About The Author: {article.author.name}</div>
              <p className={styles.bioText}>{article.author.bio}</p>
              <Link href={`/author/${article.author.id}`} style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 'bold', display: 'flex', alignItems: 'center', marginTop: '0.2rem' }}>
                View all articles by {article.author.name} <ChevronRight size={12} />
              </Link>
            </div>
          </div>

          {/* Ad slot before related articles */}
          <AdZone type="mid_article" />

          {/* Related Articles Section */}
          {related.length > 0 && (
            <div className={styles.relatedSection}>
              <h2 className={homeStyles.sectionHeading}>
                <span>Related Articles</span>
              </h2>
              <div className={styles.relatedGrid}>
                {related.map(rel => (
                  <Link key={rel.id} href={`/${rel.category.toLowerCase()}/${rel.slug}`} className={homeStyles.storyCard}>
                    <div style={{ position: 'relative', height: '110px', overflow: 'hidden' }}>
                      <img src={rel.image} alt={rel.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className={homeStyles.storyContent} style={{ padding: '0.75rem' }}>
                      <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '0.85rem', fontWeight: 'bold', lineHeight: '1.3' }}>
                        {rel.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div>
            <h3 className={styles.commentsTitle}>
              <MessageSquare size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Comments ({article.comments?.length || 0})
            </h3>
            
            {article.comments && article.comments.length > 0 ? (
              <div className={styles.commentList}>
                {article.comments.map(c => (
                  <div key={c.id} className={styles.commentCard}>
                    <div className={styles.commentMeta}>
                      <span className={styles.commentName}>{c.name}</span>
                      <span className={styles.commentTime}>{formatDate(c.timestamp)}</span>
                    </div>
                    <p className={styles.commentText}>{c.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem', border: '1px solid var(--color-border)', borderRadius: '6px', marginBottom: '2rem' }}>
                No comments posted yet. Be the first to express your thoughts!
              </div>
            )}

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
              <h4 style={{ marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Leave a comment</h4>
              {commentSuccess && (
                <div style={{ color: 'green', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  Comment posted successfully and added to moderation queues.
                </div>
              )}
              {commentError && (
                <div style={{ color: 'red', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  {commentError}
                </div>
              )}
              <div className={styles.formGrid}>
                <input 
                  type="text" 
                  required
                  placeholder="Your Name" 
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className={styles.formInput} 
                />
                <textarea 
                  required
                  placeholder="Write your comment..." 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className={styles.formTextarea} 
                />
                <button type="submit" className={styles.formBtn}>
                  Post Comment
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Sidebar Sticky Column */}
        <aside className={homeStyles.sidebar}>
          <div className={styles.sidebarSticky}>
            {/* Sidebar Ad Slot */}
            <AdZone type="sidebar_rect" />

            {/* Trending widget */}
            {trending.length > 0 && (
              <div>
                <h3 className={homeStyles.sidebarHeading}>Trending Now</h3>
                <div className={homeStyles.trendingList}>
                  {trending.map((item, idx) => (
                    <div key={item.id || idx} className={homeStyles.trendingCard}>
                      <span className={homeStyles.trendingRank}>{String(idx + 1).padStart(2, '0')}</span>
                      <div className={homeStyles.trendingDetails}>
                        <span className={homeStyles.trendingTag}>{item.category}</span>
                        <Link href={`/${item.category.toLowerCase()}/${item.slug}`} className={homeStyles.trendingTitle}>
                          {item.title}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

      </div>
    </article>
  );
}
