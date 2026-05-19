export const dynamic = 'force-dynamic';
import { getSupabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

async function getStory(id: string) {
  const { data } = await getSupabase()
    .from('stories')
    .select('*')
    .eq('id', id)
    .single();
  return data;
}

export default async function StoryPage({ params }: { params: { id: string } }) {
  const story = await getStory(params.id);

  if (!story) notFound();

  return (
    <main className="container">
      <div className="card">
        <div className="story-header">
          <span className="story-emoji">{story.cover_emoji}</span>
          <h1 className="story-title">{story.title}</h1>
          <p className="story-date">
            {new Date(story.published_at).toLocaleDateString('uk-UA', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className="story-body">
          <p className="story-text">{story.content}</p>

          {story.moral && (
            <div className="story-moral">
              <strong>💡 Мораль казки:</strong>
              <p>{story.moral}</p>
            </div>
          )}
        </div>
      </div>

      <Link href="/" className="back-link">
        ← Повернутися на головну
      </Link>
    </main>
  );
}
