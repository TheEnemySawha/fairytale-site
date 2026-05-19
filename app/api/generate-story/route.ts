import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

async function generateStory() {
  const prompt = `Напиши теплу, добру дитячу казку українською мовою для дітей від 6 років.

Довжина: приблизно 600-900 слів.
Стиль: чарівний, з гумором, позитивний.
Обов'язково додай мораль в кінці.

Формат відповіді точно такий:

Заголовок: [Назва казки]

[Повний текст казки]

Мораль: [Коротка мораль однією-двома фразами]

Emoji: [один емодзі, який найкраще підходить до казки]`;

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'Ти талановитий дитячий письменник. Відповідай лише українською мовою.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.85,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DeepSeek API error: ${err}`);
  }

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

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const story = await generateStory();
    const { error } = await getSupabaseAdmin().from('stories').insert([story]);
    if (error) throw error;
    return NextResponse.json({ success: true, story });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
