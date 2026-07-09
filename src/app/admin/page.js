'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Admin.module.css';
import { 
  Plus, Edit2, Trash2, CheckCircle2, ShieldAlert,
  Sliders, MessageSquare, Newspaper, Percent, BookOpen, AlertCircle
} from 'lucide-react';

export default function AdminCMSPage() {
  const [activeTab, setActiveTab] = useState('articles'); // articles, ticker, ads, comments
  const [articles, setArticles] = useState([]);
  const [tickerItems, setTickerItems] = useState([]);
  const [adsState, setAdsState] = useState({ leaderboard: true, sidebar_rect: true, mid_article: true });
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Modal control states
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState({
    id: '', title: '', excerpt: '', content: '', category: 'India', subCategory: '',
    authorName: '', authorDesignation: '', image: '', tagsString: ''
  });

  // Ticker form states
  const [newTickerTitle, setNewTickerTitle] = useState('');
  const [newTickerLang, setNewTickerLang] = useState('en');

  // Load dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // Load articles
      const artRes = await fetch('/api/articles');
      if (artRes.ok) {
        const artData = await artRes.json();
        setArticles(artData);
      }

      // Load configuration
      const configRes = await fetch('/api/config');
      if (configRes.ok) {
        const configData = await configRes.json();
        setTickerItems(configData.breakingNews || []);
        setAdsState(configData.ads || { leaderboard: true, sidebar_rect: true, mid_article: true });
      }

      // Load comments
      const commRes = await fetch('/api/comments');
      if (commRes.ok) {
        const commData = await commRes.json();
        setComments(commData);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handle article actions
  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentArticle({
      id: '', title: '', excerpt: '', content: '', category: 'India', subCategory: '',
      authorName: 'Staff Writer', authorDesignation: 'Staff Reporter', image: '', tagsString: ''
    });
    setArticleModalOpen(true);
  };

  const openEditModal = (art) => {
    setIsEditing(true);
    setCurrentArticle({
      id: art.id,
      title: art.title,
      excerpt: art.excerpt,
      content: art.content,
      category: art.category,
      subCategory: art.subCategory || '',
      authorName: art.author.name,
      authorDesignation: art.author.designation,
      image: art.image,
      tagsString: art.tags?.join(', ') || ''
    });
    setArticleModalOpen(true);
  };

  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    if (!currentArticle.title || !currentArticle.content) return;

    const payload = {
      ...currentArticle,
      tags: currentArticle.tagsString.split(',').map(t => t.trim()).filter(Boolean)
    };

    const method = isEditing ? 'PUT' : 'POST';
    try {
      const res = await fetch('/api/articles', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setArticleModalOpen(false);
        loadDashboardData();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Error saving article');
      }
    } catch (err) {
      console.error(err);
      alert('Network error saving article');
    }
  };

  const handleArticleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`/api/articles?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        loadDashboardData();
      } else {
        alert('Error deleting article');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Ticker operations
  const handleAddTicker = async (e) => {
    e.preventDefault();
    if (!newTickerTitle.trim()) return;

    const newTicker = {
      id: 'b-' + Math.random().toString(36).substr(2, 9),
      title: newTickerTitle.trim(),
      lang: newTickerLang
    };

    const updatedList = [...tickerItems, newTicker];
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_breaking',
          payload: updatedList
        })
      });

      if (res.ok) {
        setNewTickerTitle('');
        setTickerItems(updatedList);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTicker = async (id) => {
    const updatedList = tickerItems.filter(item => item.id !== id);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_breaking',
          payload: updatedList
        })
      });

      if (res.ok) {
        setTickerItems(updatedList);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Ads in configuration
  const handleToggleAd = async (adKey, status) => {
    const updatedAds = { ...adsState, [adKey]: status };
    setAdsState(updatedAds);
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_ad',
          payload: { adKey, status }
        })
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Moderate comments
  const handleDeleteComment = async (articleId, commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      const res = await fetch(`/api/comments?articleId=${articleId}&commentId=${commentId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        // Remove locally from state
        setComments(prev => prev.filter(c => c.id !== commentId));
      } else {
        alert('Error deleting comment');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Loading CMS Dashboard...</h2>
      </div>
    );
  }

  const activeAdsCount = Object.values(adsState).filter(Boolean).length;

  return (
    <div className={`container ${styles.adminContainer}`}>
      
      {/* CMS Header */}
      <div className={styles.adminHeader}>
        <h1 className={styles.adminTitle}>
          <ShieldAlert size={28} style={{ color: 'var(--color-accent)' }} />
          Truth Velocity CMS Panel
        </h1>
        {activeTab === 'articles' && (
          <button onClick={openCreateModal} className={`${styles.btn} ${styles.btnPrimary}`}>
            <Plus size={16} /> New Article
          </button>
        )}
      </div>

      {errorMsg && (
        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      {/* 1. Stat cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Articles</span>
          <span className={styles.statValue}>{articles.length}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Active Ad Slots</span>
          <span className={styles.statValue}>{activeAdsCount} / 3</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Moderate Comments</span>
          <span className={styles.statValue}>{comments.length}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Mock Views Today</span>
          <span className={styles.statValue}>14.2K</span>
        </div>
      </div>

      {/* 2. Tabs Bar */}
      <div className={styles.tabsBar}>
        <button 
          onClick={() => setActiveTab('articles')}
          className={`${styles.tabBtn} ${activeTab === 'articles' ? styles.activeTabBtn : ''}`}
        >
          <Newspaper size={14} style={{ display: 'inline', marginRight: '5px' }} />
          Articles
        </button>
        <button 
          onClick={() => setActiveTab('ticker')}
          className={`${styles.tabBtn} ${activeTab === 'ticker' ? styles.activeTabBtn : ''}`}
        >
          <Percent size={14} style={{ display: 'inline', marginRight: '5px' }} />
          Breaking Ticker
        </button>
        <button 
          onClick={() => setActiveTab('ads')}
          className={`${styles.tabBtn} ${activeTab === 'ads' ? styles.activeTabBtn : ''}`}
        >
          <Sliders size={14} style={{ display: 'inline', marginRight: '5px' }} />
          Ad Management
        </button>
        <button 
          onClick={() => setActiveTab('comments')}
          className={`${styles.tabBtn} ${activeTab === 'comments' ? styles.activeTabBtn : ''}`}
        >
          <MessageSquare size={14} style={{ display: 'inline', marginRight: '5px' }} />
          Comments Moderation
        </button>
      </div>

      {/* 3. Tab Contents */}
      
      {/* 3a. Articles Manager */}
      {activeTab === 'articles' && (
        <div className={styles.tableWrapper}>
          <table className={styles.cmsTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Date Published</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(art => (
                <tr key={art.id}>
                  <td style={{ fontWeight: 'bold', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <Link href={`/${art.category.toLowerCase()}/${art.slug}`} target="_blank" style={{ textDecoration: 'underline' }}>
                      {art.title}
                    </Link>
                  </td>
                  <td>{art.author.name}</td>
                  <td>
                    <span className={`badge badge-${art.category.toLowerCase()}`}>
                      {art.category}
                    </span>
                  </td>
                  <td>{new Date(art.publishedAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => openEditModal(art)}
                        className={`${styles.btn} ${styles.btnSecondary}`}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                      >
                        <Edit2 size={11} /> Edit
                      </button>
                      <button 
                        onClick={() => handleArticleDelete(art.id)}
                        className={`${styles.btn} ${styles.btnDanger}`}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                      >
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3b. Breaking Ticker Manager */}
      {activeTab === 'ticker' && (
        <div>
          {/* New Ticker Form */}
          <form onSubmit={handleAddTicker} style={{ backgroundColor: 'var(--color-bg-alt)', padding: '1.5rem', borderRadius: '6px', border: '1px solid var(--color-border)', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className={styles.formGroup} style={{ flexGrow: 1, minWidth: '250px' }}>
              <label>Ticker Headline</label>
              <input 
                type="text" 
                required
                placeholder="Type breaking headline..."
                value={newTickerTitle}
                onChange={(e) => setNewTickerTitle(e.target.value)}
                className={styles.inputField}
              />
            </div>
            <div className={styles.formGroup} style={{ width: '120px' }}>
              <label>Language</label>
              <select 
                value={newTickerLang} 
                onChange={(e) => setNewTickerLang(e.target.value)} 
                className={styles.selectField}
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} style={{ height: '36px' }}>
              Add Headline
            </button>
          </form>

          {/* Current Ticker List */}
          <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Current Ticker Items</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {tickerItems.map(item => (
              <div key={item.id} className={styles.tickerCmsItem}>
                <div>
                  <span style={{ 
                    fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '3px', marginRight: '0.6rem',
                    backgroundColor: item.lang === 'en' ? 'var(--color-primary)' : 'var(--color-accent)', color: '#fff',
                    fontWeight: 'bold', textTransform: 'uppercase'
                  }}>
                    {item.lang}
                  </span>
                  <span>{item.title}</span>
                </div>
                <button 
                  onClick={() => handleDeleteTicker(item.id)}
                  className={`${styles.btn} ${styles.btnDanger}`} 
                  style={{ padding: '0.25rem 0.4rem', fontSize: '0.7rem' }}
                >
                  <Trash2 size={11} /> Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3c. Ads Controller */}
      {activeTab === 'ads' && (
        <div style={{ border: '1px solid var(--color-border)', borderRadius: '6px', overflow: 'hidden' }}>
          <div className={styles.configRow}>
            <div className={styles.configLabel}>
              <span className={styles.configTitle}>Leaderboard Header Banner (728x90)</span>
              <span className={styles.configDesc}>Displays advertisement above main layout content on top of page.</span>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={adsState.leaderboard}
                onChange={(e) => handleToggleAd('leaderboard', e.target.checked)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.configRow}>
            <div className={styles.configLabel}>
              <span className={styles.configTitle}>Sidebar Rectangle Box (300x250)</span>
              <span className={styles.configDesc}>Displays ad container inside sticky sidebar panel on desktop layouts.</span>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={adsState.sidebar_rect}
                onChange={(e) => handleToggleAd('sidebar_rect', e.target.checked)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.configRow}>
            <div className={styles.configLabel}>
              <span className={styles.configTitle}>Mid-Article Banner (728x90)</span>
              <span className={styles.configDesc}>Displays ad banner right inside long article details and before comments.</span>
            </div>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                checked={adsState.mid_article}
                onChange={(e) => handleToggleAd('mid_article', e.target.checked)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      )}

      {/* 3d. Comments Moderation Panel */}
      {activeTab === 'comments' && (
        <div className={styles.tableWrapper}>
          <table className={styles.cmsTable}>
            <thead>
              <tr>
                <th>Article</th>
                <th>Author Name</th>
                <th>Comment</th>
                <th>Date Posted</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {comments.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 'bold' }}>
                    <Link href={`/${c.category?.toLowerCase()}/${c.articleSlug}`} target="_blank" style={{ textDecoration: 'underline' }}>
                      {c.articleTitle}
                    </Link>
                  </td>
                  <td>{c.name}</td>
                  <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.text}</td>
                  <td>{new Date(c.timestamp).toLocaleDateString()}</td>
                  <td>
                    <button 
                      onClick={() => handleDeleteComment(c.articleId, c.id)}
                      className={`${styles.btn} ${styles.btnDanger}`}
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                    >
                      <Trash2 size={11} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {comments.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--color-text-muted)' }}>
                    No comments in moderation queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. New/Edit Article Modal */}
      {articleModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3>{isEditing ? 'Edit Article' : 'Create New Article'}</h3>
              <button onClick={() => setArticleModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>
                &times;
              </button>
            </div>
            <form onSubmit={handleArticleSubmit}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Title</label>
                  <input 
                    type="text" 
                    required
                    value={currentArticle.title}
                    onChange={(e) => setCurrentArticle({...currentArticle, title: e.target.value})}
                    className={styles.inputField}
                    placeholder="Enter article title"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className={styles.formGroup}>
                    <label>Category</label>
                    <select 
                      value={currentArticle.category}
                      onChange={(e) => setCurrentArticle({...currentArticle, category: e.target.value})}
                      className={styles.selectField}
                    >
                      <option value="India">India</option>
                      <option value="World">World</option>
                      <option value="Business">Business</option>
                      <option value="Sports">Sports</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Technology">Technology</option>
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Opinion">Opinion</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Sub Category</label>
                    <input 
                      type="text" 
                      value={currentArticle.subCategory}
                      onChange={(e) => setCurrentArticle({...currentArticle, subCategory: e.target.value})}
                      className={styles.inputField}
                      placeholder="e.g. Politics, Cricket, Bollywood"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className={styles.formGroup}>
                    <label>Author Name</label>
                    <input 
                      type="text" 
                      value={currentArticle.authorName}
                      onChange={(e) => setCurrentArticle({...currentArticle, authorName: e.target.value})}
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Author Designation</label>
                    <input 
                      type="text" 
                      value={currentArticle.authorDesignation}
                      onChange={(e) => setCurrentArticle({...currentArticle, authorDesignation: e.target.value})}
                      className={styles.inputField}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Featured Image URL (Unsplash/Web)</label>
                  <input 
                    type="text" 
                    value={currentArticle.image}
                    onChange={(e) => setCurrentArticle({...currentArticle, image: e.target.value})}
                    className={styles.inputField}
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Tags (comma separated)</label>
                  <input 
                    type="text" 
                    value={currentArticle.tagsString}
                    onChange={(e) => setCurrentArticle({...currentArticle, tagsString: e.target.value})}
                    className={styles.inputField}
                    placeholder="e.g. Budget 2026, Solar Grid, Green Energy"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Short Excerpt</label>
                  <input 
                    type="text" 
                    value={currentArticle.excerpt}
                    onChange={(e) => setCurrentArticle({...currentArticle, excerpt: e.target.value})}
                    className={styles.inputField}
                    placeholder="Brief 1-2 sentence preview"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Article Body (HTML/Text)</label>
                  <textarea 
                    required
                    value={currentArticle.content}
                    onChange={(e) => setCurrentArticle({...currentArticle, content: e.target.value})}
                    className={styles.textareaField}
                    placeholder="Write article details here. HTML tags like <p> and <blockquote> are supported."
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setArticleModalOpen(false)} className={`${styles.btn} ${styles.btnSecondary}`}>
                  Cancel
                </button>
                <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
