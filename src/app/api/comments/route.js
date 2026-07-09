import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

// GET all comments for moderation
export async function GET() {
  try {
    const db = await readDB();
    let allComments = [];

    db.articles.forEach(article => {
      if (article.comments) {
        article.comments.forEach(comment => {
          allComments.push({
            ...comment,
            articleId: article.id,
            articleTitle: article.title,
            articleSlug: article.slug,
            category: article.category
          });
        });
      }
    });

    // Sort by timestamp descending (newest comments first)
    allComments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return NextResponse.json(allComments);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new comment
export async function POST(request) {
  try {
    const body = await request.json();
    const db = await readDB();
    const { articleId, name, text } = body;

    if (!articleId || !name || !text) {
      return NextResponse.json({ error: 'Article ID, Name and Text are required' }, { status: 400 });
    }

    const index = db.articles.findIndex(a => a.id === articleId);
    if (index === -1) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const newComment = {
      id: 'c-' + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    if (!db.articles[index].comments) {
      db.articles[index].comments = [];
    }

    db.articles[index].comments.push(newComment);
    await writeDB(db);

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a comment
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get('articleId');
    const commentId = searchParams.get('commentId');

    if (!articleId || !commentId) {
      return NextResponse.json({ error: 'articleId and commentId are required parameters' }, { status: 400 });
    }

    const db = await readDB();
    const index = db.articles.findIndex(a => a.id === articleId);

    if (index === -1) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const article = db.articles[index];
    const initialLength = article.comments.length;
    article.comments = article.comments.filter(c => c.id !== commentId);

    if (article.comments.length === initialLength) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    db.articles[index] = article;
    await writeDB(db);

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
