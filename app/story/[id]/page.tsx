export const dynamic = 'force-dynamic';
import { getSupabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import StarRating from '@/app/components/StarRating';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';

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
          <p className="story-date">
            {new Date(story.published_at).toLocaleDateString('uk-UA', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>

        <div className="story-body">
          <LanguageSwitcher story={story} />
          <StarRating storyId={story.id} />
        </div>
      </div>

      <Link href="/" className="back-link">← Повернутися на головну</Link>
    </main>
  );
}
