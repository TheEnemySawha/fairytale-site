import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

async function callDeepSeek(systemPrompt: string, userPrompt: string) {
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
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
  return data.choices[0].message.content;
}

function parseStory(text: string, titleKey: string, moralKey: string) {
  const titleMatch = text.match(new RegExp(`${titleKey}:\\s*(.+)`, 'i'));
  const moralMatch = text.match(new RegExp(`${moralKey}:\\s*(.+)`, 'i'));
  const emojiMatch = text.match(/Emoji:\s*(.+)/i);

  const title = titleMatch ? titleMatch[1].trim() : '';
  const moral = moralMatch ? moralMatch[1].trim() : '';
  const cover_emoji = emojiMatch ? emojiMatch[1].trim() : '📖';

  const content = text
    .replace(new RegExp(`${titleKey}:.+`, 'i'), '')
    .replace(new RegExp(`${moralKey}:.+`, 'i'), '')
    .replace(/Emoji:.+/i, '')
    .trim();

  return { title, content, moral, cover_emoji };
}

async function generateStory() {
  const uaPrompt = `Напиши теплу, добру дитячу казку українською мовою для дітей від 6 років.

Довжина: приблизно 600-900 слів.
Стиль: чарівний, з гумором, позитивний.
Обов'язково додай мораль в кінці.

Формат відповіді точно такий:

Заголовок: [Назва казки]

[Повний текст казки]

Мораль: [Коротка мораль однією-двома фразами]

Emoji: [один емодзі, який найкраще підходить до казки]`;

  // Generate Ukrainian version first
  const uaText = await callDeepSeek(
    'Ти талановитий дитячий письменник. Відповідай лише українською мовою.',
    uaPrompt
  );
  const ua = parseStory(uaText, 'Заголовок', 'Мораль');

  // Generate English version
  const enPrompt = `Translate this Ukrainian children's fairy tale into English. Keep the same warm, magical style.

Use this exact format:

Title: [Story title in English]

[Full story text in English]

Moral: [The moral in English]

Here is the Ukrainian story to translate:

${uaText}`;

  const enText = await callDeepSeek(
    'You are a professional children\'s book translator. Respond only in English.',
    enPrompt
  );
  const en = parseStory(enText, 'Title', 'Moral');

  // Generate Spanish version
  const esPrompt = `Translate this Ukrainian children's fairy tale into Spanish. Keep the same warm, magical style.

Use this exact format:

Título: [Story title in Spanish]

[Full story text in Spanish]

Moraleja: [The moral in Spanish]

Here is the Ukrainian story to translate:

${uaText}`;

  const esText = await callDeepSeek(
    'Eres un traductor profesional de libros infantiles. Responde solo en español.',
    esPrompt
  );
  const es = parseStory(esText, 'Título', 'Moraleja');

  return {
    title: ua.title,
    content: ua.content,
    moral: ua.moral,
    cover_emoji: ua.cover_emoji,
    title_en: en.title,
    content_en: en.content,
    moral_en: en.moral,
    title_es: es.title,
    content_es: es.content,
    moral_es: es.moral,
    published_at: new Date().toISOString(),
  };
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
