'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import styles from './Home.module.css';
import AdZone from '@/components/AdZone';
import { Play, Calendar, Clock, ChevronRight, Mail } from 'lucide-react';

export default function HomePage() {
  const { language } = useApp();
  const [articles, setArticles] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Newsletter state
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Fetch articles and config
  useEffect(() => {
    const fetchData = async () => {
      try {
        const artRes = await fetch('/api/articles');
        const artData = await artRes.json();
        
        const configRes = await fetch('/api/config');
        const configData = await configRes.json();

        setArticles(artData);
        if (configData.trending) {
          setTrending(configData.trending);
        }
      } catch (err) {
        console.error("Error loading homepage data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const getTranslation = (key) => {
    const labels = {
      topStories: { en: 'Top Stories', hi: 'प्रमुख समाचार' },
      editorsPicks: { en: "Editor's Picks", hi: 'संपादक की पसंद' },
      videoReports: { en: 'Video Reports', hi: 'वीडियो रिपोर्ट' },
      trending: { en: 'Most Read', hi: 'सबसे लोकप्रिय' },
      newsletterTitle: { en: 'Subscribe to Our Newsletter', hi: 'हमारे न्यूज़लेटर की सदस्यता लें' },
      newsletterDesc: { en: 'Get the latest breaking news delivered straight to your inbox.', hi: 'अपने इनबॉक्स में सीधे नवीनतम ब्रेकिंग न्यूज प्राप्त करें।' },
      subscribe: { en: 'Subscribe', hi: 'सदस्यता लें' },
      subscribed: { en: 'Thank you for subscribing!', hi: 'सदस्यता लेने के लिए धन्यवाद!' },
      emailPlaceholder: { en: 'Enter your email address', hi: 'अपना ईमेल पता दर्ज करें' },
      viewAll: { en: 'View All', hi: 'सभी देखें' },
      hoursAgo: { en: 'hours ago', hi: 'घंटे पहले' },
      yesterday: { en: 'Yesterday', hi: 'कल' },
      opinionDesignation: { en: 'Opinion & Editorial Column', hi: 'विचार एवं संपादकीय कॉलम' }
    };
    return labels[key]?.[language] || '';
  };

  // Mock relative time format helper
  const getRelativeTime = (isoString) => {
    const diffMs = new Date() - new Date(isoString);
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 1) return language === 'en' ? 'Just now' : 'अभी-अभी';
    if (diffHrs < 24) return `${diffHrs} ${getTranslation('hoursAgo')}`;
    return getTranslation('yesterday');
  };

  // Mock Videos list
  const mockVideos = [
    {
      title: "India's ₹50k Cr Green Infrastructure Budget Decoded",
      duration: "3:45",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&auto=format&fit=crop&q=80"
    },
    {
      title: "Federal Reserve Signals: What it means for Emerging Markets",
      duration: "4:12",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&auto=format&fit=crop&q=80"
    },
    {
      title: "Cricket World Cup Selection Committee Behind-The-Scenes",
      duration: "5:30",
      image: "https://images.unsplash.com/photo-1531415080290-b9b6fa5031b8?w=400&auto=format&fit=crop&q=80"
    },
    {
      title: "Deep Dive: System 2 Reasoning AI Breakthrough",
      duration: "6:15",
      image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=400&auto=format&fit=crop&q=80"
    }
  ];

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        {/* Skeleton loading grid */}
        <div style={{ height: '400px', width: '100%', marginBottom: '2rem' }} className="skeleton" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {[1, 2, 3, 4].map(n => (
            <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ height: '150px' }} className="skeleton" />
              <div style={{ height: '20px', width: '60%' }} className="skeleton" />
              <div style={{ height: '30px' }} className="skeleton" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Segment articles
  const leadStory = articles[0];
  const secondaryStories = articles.slice(1, 4);
  const topStories = articles.slice(0, 4);

  // Group by category for Category Blocks
  const sportsNews = articles.filter(a => a.category.toLowerCase() === 'sports');
  const techNews = articles.filter(a => a.category.toLowerCase() === 'technology' || a.category.toLowerCase() === 'tech');
  const businessNews = articles.filter(a => a.category.toLowerCase() === 'business');
  
  // Opinion articles
  const opinionNews = articles.filter(a => a.category.toLowerCase().includes('opinion'));

  return (
    <div className="container">
      {/* Top Banner Ad */}
      <AdZone type="leaderboard" />

      {/* Main Page Layout Grid */}
      <div className={styles.homeGrid}>
        
        {/* Left Side Main Column */}
        <div>
          {/* Section 1: Hero/Lead Story Zone */}
          {leadStory && (
            <section className={styles.heroZone}>
              {/* Lead Large Story (60% equivalent) */}
              <Link href={`/${leadStory.category.toLowerCase()}/${leadStory.slug}`} className={styles.leadStory}>
                <img 
                  src={leadStory.image} 
                  alt={leadStory.title} 
                  className={styles.leadImage}
                />
                <div className={styles.leadOverlay}>
                  <div className={styles.leadMeta}>
                    <span className={`badge badge-${leadStory.category.toLowerCase()}`}>
                      {leadStory.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Clock size={11} /> {leadStory.readTime}
                    </span>
                  </div>
                  <h2 className={styles.leadTitle}>{leadStory.title}</h2>
                  <p className={styles.leadExcerpt}>{leadStory.excerpt}</p>
                </div>
              </Link>

              {/* Stacked Secondary Stories (40% equivalent) */}
              <div className={styles.secondaryStories}>
                {secondaryStories.map((story) => (
                  <Link 
                    key={story.id} 
                    href={`/${story.category.toLowerCase()}/${story.slug}`} 
                    className={styles.secondaryCard}
                  >
                    <div className={styles.secThumbWrapper}>
                      <img src={story.image} alt={story.title} className={styles.secThumb} />
                    </div>
                    <div className={styles.secInfo}>
                      <span className={styles.secTag}>{story.category}</span>
                      <h3 className={styles.secTitle}>{story.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Mid Content Ad */}
          <AdZone type="mid_article" />

          {/* Section 2: Top Stories / Category Highlights */}
          <section style={{ marginBottom: '2.5rem' }}>
            <h2 className={styles.sectionHeading}>
              <span>{getTranslation('topStories')}</span>
              <span className={styles.viewAll}>{getTranslation('viewAll')} →</span>
            </h2>
            <div className={styles.topStoriesGrid}>
              {topStories.map((story) => (
                <Link 
                  key={story.id} 
                  href={`/${story.category.toLowerCase()}/${story.slug}`} 
                  className={styles.storyCard}
                >
                  <div className={styles.storyImgWrapper}>
                    <img src={story.image} alt={story.title} className={styles.storyImg} />
                  </div>
                  <div className={styles.storyContent}>
                    <span className={`badge badge-${story.category.toLowerCase()} ${styles.cardTag}`}>
                      {story.category}
                    </span>
                    <h3 className={styles.storyTitle}>{story.title}</h3>
                    <p className={styles.storyExcerpt}>{story.excerpt}</p>
                    <div className={styles.storyMeta}>
                      <span>{getRelativeTime(story.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Section 3: Editor's Pick / Opinion Panel (Visually distinguished bg) */}
          {opinionNews.length > 0 && (
            <section className={styles.opinionSection}>
              <div style={{ padding: '0 1.25rem' }}>
                <h2 className={`${styles.sectionHeading} ${styles.headingUnderlineRed}`}>
                  <span>{getTranslation('editorsPicks')}</span>
                  <Link href="/opinion" className={styles.viewAll}>{getTranslation('viewAll')} →</Link>
                </h2>
                <div className={styles.opinionGrid}>
                  {opinionNews.slice(0, 3).map((op) => (
                    <Link key={op.id} href={`/${op.category.toLowerCase()}/${op.slug}`} className={styles.opinionCard}>
                      <div className={styles.opinionQuote}>
                        {op.title}
                      </div>
                      <div className={styles.authorBox}>
                        <img src={op.author.image} alt={op.author.name} className={styles.authorImg} />
                        <div>
                          <div className={styles.authorName}>{op.author.name}</div>
                          <div className={styles.authorRole}>{op.author.designation}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Section 4: Video / Multimedia Strip */}
          <section className={styles.videoStripSection}>
            <h2 className={styles.sectionHeading}>
              <span>{getTranslation('videoReports')}</span>
              <span className={styles.viewAll}>{getTranslation('viewAll')} →</span>
            </h2>
            <div className={`${styles.videoCarousel} scrollbar-thin`}>
              {mockVideos.map((video, idx) => (
                <div key={idx} className={styles.videoCard}>
                  <div className={styles.videoThumbWrapper}>
                    <img src={video.image} alt={video.title} className={styles.videoThumb} />
                    <div className={styles.playBtnOverlay}>
                      <span className={styles.playIconCircle}>
                        <Play size={18} fill="#ffffff" />
                      </span>
                    </div>
                    <span className={styles.durationBadge}>{video.duration}</span>
                  </div>
                  <h3 className={styles.videoTitle}>{video.title}</h3>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Category-wise Grid Blocks (Sports, Entertainment, Business, Tech) */}
          <section className={styles.categoryBlocksGrid}>
            
            {/* Sports Block */}
            <div className={styles.catBlock}>
              <h2 className={styles.sectionHeading}>
                <span>{language === 'en' ? 'Sports' : 'खेल'}</span>
                <Link href="/sports" className={styles.viewAll}>{getTranslation('viewAll')} →</Link>
              </h2>
              {sportsNews.length > 0 && (
                <>
                  <Link href={`/sports/${sportsNews[0].slug}`} className={styles.catFeatured}>
                    <img src={sportsNews[0].image} alt={sportsNews[0].title} className={styles.catFeaturedImg} />
                    <div className={styles.catFeaturedContent}>
                      <h3 className={styles.catFeaturedTitle}>{sportsNews[0].title}</h3>
                      <p className={styles.catFeaturedExcerpt}>{sportsNews[0].excerpt}</p>
                    </div>
                  </Link>
                  <div className={styles.catList}>
                    {sportsNews.slice(1, 4).map(s => (
                      <Link key={s.id} href={`/sports/${s.slug}`} className={styles.catListItem}>
                        <h4 className={styles.catListTitle}>{s.title}</h4>
                        <span className={styles.catListTime}>{getRelativeTime(s.publishedAt)}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Business Block */}
            <div className={styles.catBlock}>
              <h2 className={styles.sectionHeading}>
                <span>{language === 'en' ? 'Business' : 'कारोबार'}</span>
                <Link href="/business" className={styles.viewAll}>{getTranslation('viewAll')} →</Link>
              </h2>
              {businessNews.length > 0 && (
                <>
                  <Link href={`/business/${businessNews[0].slug}`} className={styles.catFeatured}>
                    <img src={businessNews[0].image} alt={businessNews[0].title} className={styles.catFeaturedImg} />
                    <div className={styles.catFeaturedContent}>
                      <h3 className={styles.catFeaturedTitle}>{businessNews[0].title}</h3>
                      <p className={styles.catFeaturedExcerpt}>{businessNews[0].excerpt}</p>
                    </div>
                  </Link>
                  <div className={styles.catList}>
                    {businessNews.slice(1, 4).map(b => (
                      <Link key={b.id} href={`/business/${b.slug}`} className={styles.catListItem}>
                        <h4 className={styles.catListTitle}>{b.title}</h4>
                        <span className={styles.catListTime}>{getRelativeTime(b.publishedAt)}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

          </section>
        </div>

        {/* Right Side Sidebar Column */}
        <aside className={styles.sidebar}>
          
          {/* Section 6: Trending / Most Read Widget */}
          {trending.length > 0 && (
            <div>
              <h3 className={styles.sidebarHeading}>{getTranslation('trending')}</h3>
              <div className={styles.trendingList}>
                {trending.map((item, idx) => (
                  <div key={item.id || idx} className={styles.trendingCard}>
                    <span className={styles.trendingRank}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div className={styles.trendingDetails}>
                      <span className={styles.trendingTag}>{item.category}</span>
                      <Link href={`/${item.category.toLowerCase()}/${item.slug}`} className={styles.trendingTitle}>
                        {item.title}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sidebar Advertisement */}
          <AdZone type="sidebar_rect" />

          {/* Section 7: Mini Newsletter Form */}
          <div className={styles.newsletterWidget}>
            <Mail size={32} style={{ color: 'var(--color-secondary-accent)', marginBottom: '0.5rem' }} />
            <h3>{getTranslation('newsletterTitle')}</h3>
            <p>{getTranslation('newsletterDesc')}</p>
            {subscribed ? (
              <div style={{ color: 'var(--color-secondary-accent)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                {getTranslation('subscribed')}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className={styles.widgetForm}>
                <input 
                  type="email" 
                  required
                  placeholder={getTranslation('emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.widgetInput}
                />
                <button type="submit" className={styles.widgetBtn}>
                  →
                </button>
              </form>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}
