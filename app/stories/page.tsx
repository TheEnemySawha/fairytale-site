import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

async function getAllStories() {
  const { data } = await supabase
    .from('stories')
    .select('*')
    .order('published_at', { ascending: false });
  
  return data || [];
}

export default async function StoriesPage() {
  const stories = await getAllStories();

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-purple-800 mb-4">📚 Всі казки</h1>
          <p className="text-xl text-purple-600">Архів щоденних історій</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <Card key={story.id} className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="text-4xl mb-3">{story.cover_emoji}</div>
                <CardTitle className="line-clamp-2 text-xl">{story.title}</CardTitle>
                <p className="text-sm text-gray-500">
                  {new Date(story.published_at).toLocaleDateString('uk-UA')}
                </p>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-4 text-gray-600 text-sm mb-4">
                  {story.content.substring(0, 180)}...
                </p>
                <Link 
                  href={`/story/${story.id}`}
                  className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center gap-1"
                >
                  Читати повністю →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {stories.length === 0 && (
          <p className="text-center text-gray-500 text-xl py-20">
            Поки що немає казок. Перша згенерується о 7:00 ранку.
          </p>
        )}
      </div>
    </main>
  );
}