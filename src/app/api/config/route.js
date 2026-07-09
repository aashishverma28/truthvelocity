import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET() {
  try {
    const db = await readDB();
    
    // Resolve trending article details (title, slug, category) for display
    const resolvedTrending = db.trending.map((id, index) => {
      const art = db.articles.find(a => a.id === id);
      return {
        id,
        rank: index + 1,
        title: art ? art.title : 'Deleted Article',
        slug: art ? art.slug : '',
        category: art ? art.category : ''
      };
    });

    return NextResponse.json({
      breakingNews: db.breakingNews,
      ads: db.ads,
      trending: resolvedTrending,
      allArticleMeta: db.articles.map(a => ({ id: a.id, title: a.title }))
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const db = await readDB();
    const { action, payload } = body;

    if (action === 'update_breaking') {
      db.breakingNews = payload; // Array of { id, title, lang }
    } else if (action === 'toggle_ad') {
      const { adKey, status } = payload;
      if (db.ads && adKey in db.ads) {
        db.ads[adKey] = status;
      }
    } else if (action === 'update_trending') {
      db.trending = payload; // Array of IDs
    } else {
      return NextResponse.json({ error: 'Invalid config action' }, { status: 400 });
    }

    await writeDB(db);
    return NextResponse.json({ success: true, message: 'Configuration updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
