import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

async function generateStory() {
  const prompt = `Напиши теплу, добру дитячу казку українською мовою для дітей від 6 років.\n\nДовжина: приблизно 600-900 слів.\nСтиль: чарівний, з гумором, позитивний.\nОбов'язково додай мораль в кінці.\n\nФормат відповіді точно такий:\n\nЗаголовок: [Назва казки]\n\n[Повний текст казки]\n\nМораль: [Коротка мораль однією-двома фразами]\n\nEmoji: [один емодзі, який найкраще підходить до казки]`;

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "grok-4",
      messages: [
        { role: "system", content: "Ти талановитий дитячий письменник." },
        { role: "user", content: prompt }
      ],
      temperature: 0.85,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) throw new Error('Grok API error');

  const data = await response.json();
  const fullText = data.choices[0].message.content;

  const titleMatch = fullText.match(/Заголовок:\s*(.+)/i);
  const moralMatch = fullText.match(/Мораль:\s*(.+)/i);
  const emojiMatch = fullText.match(/Emoji:\s*(.+)/i);

  const title = titleMatch ? titleMatch[1].trim() : 'Казка Дня';
  const moral = moralMatch ? moralMatch[1].trim() : 'Доброта перемагає';
  const cover_emoji = emojiMatch ? emojiMatch[1].trim() : '📖';

  const content = fullText
    .replace(/Заголовок:.+/i, '')
    .replace(/Мораль:.+/i, '')
    .replace(/Emoji:.+/i, '')
    .trim();

  return { title, content, moral, cover_emoji, published_at: new Date().toISOString() };
}

export async function GET() {
  try {
    const story = await generateStory();
    const { error } = await getSupabaseAdmin().from('stories').insert([story]);
    if (error) throw error;
    return NextResponse.json({ success: true, story });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
