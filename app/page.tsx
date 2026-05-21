export const dynamic = 'force-dynamic';
import { getSupabase } from '@/lib/supabase';
import Link from 'next/link';

async function getLatestStory() {
  const { data } = await getSupabase()
    .from('stories')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(1)
    .single();
  return data;
}

export default async function HomePage() {
  const story = await getLatestStory();

  return (
    <main>
      <div className="home-hero">
        <h1>🧚 Казковий Край</h1>
        <p>Нова казка кожного ранку — спеціально для тебе</p>
        <p className="dedication">з любов'ю для моєї доньки Варвари та дружини Анни 🌸</p>
      </div>

      <div className="container" style={{ paddingTop: 0 }}>
        {story ? (
          <>
            <div className="featured-story">
              <p className="featured-label">Казка дня</p>
              <span className="featured-emoji">{story.cover_emoji}</span>
              <h2 className="featured-title">{story.title}</h2>
              <p className="featured-date">
                {new Date(story.published_at).toLocaleDateString('uk-UA', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <p className="featured-excerpt">
                {story.content.substring(0, 220)}…
              </p>
              <Link href={`/story/${story.id}`} className="btn">
                Читати казку
              </Link>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link href="/stories" className="btn-ghost">
                📚 Всі казки
              </Link>
            </div>
          </>
        ) : (
          <p className="empty-state">
            Перша казка з'явиться сьогодні о 7:00 ранку ✨
          </p>
        )}
      </div>
    </main>
  );
}
