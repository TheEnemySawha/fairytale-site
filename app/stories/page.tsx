export const dynamic = 'force-dynamic';
import { getSupabase } from '@/lib/supabase';
import Link from 'next/link';

async function getAllStories() {
  const { data } = await getSupabase()
    .from('stories')
    .select('*')
    .order('published_at', { ascending: false });
  return data || [];
}

export default async function StoriesPage() {
  const stories = await getAllStories();

  return (
    <main className="container--wide">
      <div className="page-header">
        <h1>📚 Всі казки</h1>
        <p>Архів щоденних історій</p>
      </div>

      {stories.length === 0 ? (
        <p className="empty-state">
          Поки що немає казок. Перша згенерується о 7:00 ранку.
        </p>
      ) : (
        <div className="stories-grid">
          {stories.map((story) => (
            <div key={story.id} className="story-card">
              <span className="story-card-emoji">{story.cover_emoji}</span>
              <h2 className="story-card-title">{story.title}</h2>
              <p className="story-card-date">
                {new Date(story.published_at).toLocaleDateString('uk-UA')}
              </p>
              <p className="story-card-excerpt">
                {story.content.substring(0, 180)}…
              </p>
              <Link href={`/story/${story.id}`} className="story-card-link">
                Читати повністю →
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
