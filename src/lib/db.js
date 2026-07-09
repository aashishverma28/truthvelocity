import { supabase } from './supabaseClient';

export async function readDB() {
  try {
    // 1. Fetch articles and their joined comments
    const { data: articlesData, error: artError } = await supabase
      .from('articles')
      .select('*, comments(*)');

    if (artError) throw artError;

    const articles = (articlesData || []).map(a => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      content: a.content,
      category: a.category,
      subCategory: a.sub_category,
      publishedAt: a.published_at,
      updatedAt: a.updated_at,
      readTime: a.read_time,
      image: a.image,
      tags: a.tags || [],
      author: {
        id: a.author_id,
        name: a.author_name,
        designation: a.author_designation,
        bio: a.author_bio,
        image: a.author_image
      },
      // Sort comments chronologically (oldest first)
      comments: (a.comments || []).map(c => ({
        id: c.id,
        name: c.name,
        text: c.text,
        timestamp: c.timestamp
      })).sort((x, y) => new Date(x.timestamp) - new Date(y.timestamp))
    }));

    // 2. Fetch breaking news ticker items
    const { data: breakingData, error: breakError } = await supabase
      .from('breaking_news')
      .select('*');

    if (breakError) throw breakError;

    const breakingNews = (breakingData || []).map(b => ({
      id: b.id,
      title: b.title,
      lang: b.lang
    }));

    // 3. Fetch configurations (trending and ads)
    const { data: configData, error: configError } = await supabase
      .from('config')
      .select('*');

    if (configError) throw configError;

    const adsConfig = configData?.find(c => c.key === 'ads')?.value || { leaderboard: true, sidebar_rect: true, mid_article: true };
    const trendingConfig = configData?.find(c => c.key === 'trending')?.value || [];

    // Sort articles by publishedAt descending (latest first)
    articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    return {
      articles,
      breakingNews,
      trending: trendingConfig,
      ads: adsConfig
    };
  } catch (error) {
    console.error("Error reading from Supabase database:", error);
    return { articles: [], breakingNews: [], trending: [], ads: {} };
  }
}

export async function writeDB(data) {
  try {
    // 1. Reconcile Articles
    const dbArticles = data.articles.map(a => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      content: a.content,
      category: a.category,
      sub_category: a.subCategory,
      published_at: a.publishedAt,
      updated_at: a.updatedAt,
      read_time: a.readTime,
      image: a.image,
      tags: a.tags,
      author_id: a.author?.id || 'staff',
      author_name: a.author?.name || 'Staff Writer',
      author_designation: a.author?.designation || 'Staff Reporter',
      author_bio: a.author?.bio || 'Journalist.',
      author_image: a.author?.image || ''
    }));

    const activeArticleIds = data.articles.map(a => a.id);
    
    // Delete articles from Supabase that are no longer in our local state
    if (activeArticleIds.length > 0) {
      const { error: delArtErr } = await supabase
        .from('articles')
        .delete()
        .not('id', 'in', `(${activeArticleIds.join(',')})`);
      if (delArtErr) throw delArtErr;
    } else {
      const { error: delAllErr } = await supabase.from('articles').delete().neq('id', '');
      if (delAllErr) throw delAllErr;
    }

    // Upsert the current list of articles
    if (dbArticles.length > 0) {
      const { error: upsertArtErr } = await supabase.from('articles').upsert(dbArticles);
      if (upsertArtErr) throw upsertArtErr;
    }

    // 2. Reconcile Comments
    let dbComments = [];
    data.articles.forEach(a => {
      if (a.comments) {
        a.comments.forEach(c => {
          dbComments.push({
            id: c.id,
            article_id: a.id,
            name: c.name,
            text: c.text,
            timestamp: c.timestamp
          });
        });
      }
    });

    const activeCommentIds = dbComments.map(c => c.id);
    
    // Delete comments from Supabase that are no longer in our local state
    if (activeCommentIds.length > 0) {
      const { error: delCommErr } = await supabase
        .from('comments')
        .delete()
        .not('id', 'in', `(${activeCommentIds.join(',')})`);
      if (delCommErr) throw delCommErr;
    } else {
      const { error: delAllCommErr } = await supabase.from('comments').delete().neq('id', '');
      if (delAllCommErr) throw delAllCommErr;
    }

    // Upsert current comments
    if (dbComments.length > 0) {
      const { error: upsertCommErr } = await supabase.from('comments').upsert(dbComments);
      if (upsertCommErr) throw upsertCommErr;
    }

    // 3. Reconcile Breaking News Tickers
    const dbBreaking = data.breakingNews.map(b => ({
      id: b.id,
      title: b.title,
      lang: b.lang
    }));

    const activeBreakingIds = dbBreaking.map(b => b.id);
    
    // Delete old breaking news tickers
    if (activeBreakingIds.length > 0) {
      const { error: delBreakErr } = await supabase
        .from('breaking_news')
        .delete()
        .not('id', 'in', `(${activeBreakingIds.join(',')})`);
      if (delBreakErr) throw delBreakErr;
    } else {
      const { error: delAllBreakErr } = await supabase.from('breaking_news').delete().neq('id', '');
      if (delAllBreakErr) throw delAllBreakErr;
    }

    // Upsert current breaking news
    if (dbBreaking.length > 0) {
      const { error: upsertBreakErr } = await supabase.from('breaking_news').upsert(dbBreaking);
      if (upsertBreakErr) throw upsertBreakErr;
    }

    // 4. Upsert Configurations (trending and ads)
    const { error: upsertConfigErr } = await supabase.from('config').upsert([
      { key: 'ads', value: data.ads },
      { key: 'trending', value: data.trending }
    ]);

    if (upsertConfigErr) throw upsertConfigErr;

    return true;
  } catch (error) {
    console.error("Error writing to Supabase database:", error);
    return false;
  }
}
