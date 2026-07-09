import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function GET(request) {
  try {
    const db = await readDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');
    const search = searchParams.get('search');
    const authorId = searchParams.get('authorId');

    let result = [...db.articles];

    // Filter by slug
    if (slug) {
      const article = result.find(a => a.slug === slug);
      if (!article) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }
      return NextResponse.json(article);
    }

    // Filter by category
    if (category) {
      const catLower = category.toLowerCase();
      result = result.filter(a => {
        // Support categories like 'Opinion/Editorial' mapping to 'opinion'
        if (catLower === 'opinion') {
          return a.category.toLowerCase().includes('opinion');
        }
        return a.category.toLowerCase() === catLower;
      });
    }

    // Filter by author
    if (authorId) {
      result = result.filter(a => a.author.id === authorId);
    }

    // Filter by search query
    if (search) {
      const query = search.toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(query) || 
        a.excerpt.toLowerCase().includes(query) || 
        a.content.toLowerCase().includes(query)
      );
    }

    // Sort by published date descending (latest first)
    result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const db = await readDB();

    const { title, excerpt, content, category, subCategory, authorName, authorDesignation, image, tags } = body;

    if (!title || !content || !category) {
      return NextResponse.json({ error: 'Title, Content and Category are required' }, { status: 400 });
    }

    // Generate fields
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const id = 'art-' + Math.random().toString(36).substr(2, 9);
    
    // Default author profile photo
    const authorImage = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80";

    const newArticle = {
      id,
      slug,
      title,
      excerpt: excerpt || content.replace(/<[^>]*>/g, '').slice(0, 150) + '...',
      content,
      category,
      subCategory: subCategory || '',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readTime: `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min read`,
      author: {
        id: 'auth-' + (authorName || 'Staff').toLowerCase().replace(/\s+/g, '-'),
        name: authorName || 'Staff Writer',
        designation: authorDesignation || 'Staff Reporter',
        bio: 'Journalist at Truth Velocity covering latest news and updates.',
        image: authorImage
      },
      image: image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=80',
      tags: tags || [],
      comments: []
    };

    db.articles.push(newArticle);
    
    // Add to trending if it fits
    if (db.trending.length < 5) {
      db.trending.push(id);
    }

    await writeDB(db);
    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const db = await readDB();

    const { id, title, excerpt, content, category, subCategory, authorName, authorDesignation, image, tags } = body;

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    const index = db.articles.findIndex(a => a.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const existing = db.articles[index];

    // Regenerate slug if title changed
    let slug = existing.slug;
    if (title && title !== existing.title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }

    const updatedArticle = {
      ...existing,
      slug,
      title: title || existing.title,
      excerpt: excerpt !== undefined ? excerpt : existing.excerpt,
      content: content || existing.content,
      category: category || existing.category,
      subCategory: subCategory !== undefined ? subCategory : existing.subCategory,
      updatedAt: new Date().toISOString(),
      readTime: content ? `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min read` : existing.readTime,
      author: {
        ...existing.author,
        name: authorName || existing.author.name,
        designation: authorDesignation || existing.author.designation
      },
      image: image || existing.image,
      tags: tags || existing.tags
    };

    db.articles[index] = updatedArticle;
    await writeDB(db);

    return NextResponse.json(updatedArticle);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
    }

    const db = await readDB();
    const index = db.articles.findIndex(a => a.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    db.articles.splice(index, 1);
    
    // Clean up from trending list
    db.trending = db.trending.filter(tid => tid !== id);

    await writeDB(db);
    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
