import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

async function getStory(id: string) {
  const { data } = await supabase
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
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12">
      <div className="max-w-3xl mx-auto px-6">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pt-10 pb-6">
            <div className="text-7xl mb-6">{story.cover_emoji}</div>
            <h1 className="text-4xl font-bold text-purple-900 leading-tight">
              {story.title}
            </h1>
            <p className="text-gray-500 flex items-center justify-center gap-2 mt-4">
              <Calendar className="w-5 h-5" />
              {new Date(story.published_at).toLocaleDateString('uk-UA', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </CardHeader>

          <CardContent className="prose prose-lg max-w-none px-8 pb-12">
            <div className="whitespace-pre-wrap leading-relaxed text-gray-700 text-[17px]">
              {story.content}
            </div>

            {story.moral && (
              <div className="mt-12 p-8 bg-amber-50 border-l-4 border-amber-500 rounded-r-2xl">
                <p className="font-bold text-amber-800 text-lg">💡 Мораль казки:</p>
                <p className="mt-3 text-amber-700 leading-relaxed">{story.moral}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-10">
          <a href="/" className="text-purple-600 hover:underline">
            ← Повернутися на головну
          </a>
        </div>
      </div>
    </main>
  );
}import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

async function getStory(id: string) {
  const { data } = await supabase
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
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12">
      <div className="max-w-3xl mx-auto px-6">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pt-10 pb-6">
            <div className="text-7xl mb-6">{story.cover_emoji}</div>
            <h1 className="text-4xl font-bold text-purple-900 leading-tight">
              {story.title}
            </h1>
            <p className="text-gray-500 flex items-center justify-center gap-2 mt-4">
              <Calendar className="w-5 h-5" />
              {new Date(story.published_at).toLocaleDateString('uk-UA', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </CardHeader>

          <CardContent className="prose prose-lg max-w-none px-8 pb-12">
            <div className="whitespace-pre-wrap leading-relaxed text-gray-700 text-[17px]">
              {story.content}
            </div>

            {story.moral && (
              <div className="mt-12 p-8 bg-amber-50 border-l-4 border-amber-500 rounded-r-2xl">
                <p className="font-bold text-amber-800 text-lg">💡 Мораль казки:</p>
                <p className="mt-3 text-amber-700 leading-relaxed">{story.moral}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-10">
          <a href="/" className="text-purple-600 hover:underline">
            ← Повернутися на головну
          </a>
        </div>
      </div>
    </main>
  );
}