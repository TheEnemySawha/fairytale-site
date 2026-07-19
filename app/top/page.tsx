export const dynamic = 'force-dynamic';
import { getSupabase } from '@/lib/supabase';
import Link from 'next/link';

async function getTopStories() {
  const { data: ratings } = await getSupabase()
    .from('ratings')
    .select('story_id, stars');

  if (!ratings || ratings.length === 0) return [];

  // Calculate avg and count per story
  const map: Record<number, { sum: number; count: number }> = {};
  for (const r of ratings) {
    if (!map[r.story_id]) map[r.story_id] = { sum: 0, count: 0 };
    map[r.story_id].sum += r.stars;
    map[r.story_id].count += 1;
  }

  const storyIds = Object.keys(map).map(Number);

  const { data: stories } = await getSupabase()
    .from('stories')
    .select('*')
    .in('id', storyIds);

  if (!stories) return [];

  return stories
    .map(s => ({
      ...s,
      avg: map[s.id].sum / map[s.id].count,
      count: map[s.id].count,
    }))
    .sort((a, b) => b.avg - a.avg);
}

export default async function TopPage() {
  const stories = await getTopStories();

  return (
    <main className="container--wide">
      <div className="page-header">
        <h1>🏆 Топ казки</h1>
        <p>Найкраще оцінені читачами</p>
      </div>

      {stories.length === 0 ? (
        <p className="empty-state">Поки що немає оцінок. Читай казки і залишай зірочки! ⭐</p>
      ) : (
        <div className="top-list">
          {stories.map((story, i) => (
            <Link key={story.id} href={`/story/${story.id}`} className="top-card">
              <div className="top-rank">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</div>
              <div className="top-emoji">{story.cover_emoji}</div>
              <div className="top-info">
                <h2 className="top-title">{story.title}</h2>
                <p className="top-date">{new Date(story.published_at).toLocaleDateString('uk-UA')}</p>
              </div>
              <div className="top-rating">
                <span className="top-stars">{'★'.repeat(Math.round(story.avg))}{'☆'.repeat(5 - Math.round(story.avg))}</span>
                <span className="top-avg">{story.avg.toFixed(1)}</span>
                <span className="top-count">{story.count} {story.count === 1 ? 'оцінка' : story.count < 5 ? 'оцінки' : 'оцінок'}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link href="/" className="back-link">← На головну</Link>
      </div>
    </main>
  );
}
