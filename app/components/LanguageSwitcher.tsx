'use client';

import { useState } from 'react';

type Story = {
  title: string;
  content: string;
  moral: string;
  title_en?: string;
  content_en?: string;
  moral_en?: string;
  title_es?: string;
  content_es?: string;
  moral_es?: string;
};

type Lang = 'ua' | 'en' | 'es';

export default function LanguageSwitcher({ story }: { story: Story }) {
  const [lang, setLang] = useState<Lang>('ua');

  const langs = [
    { code: 'ua' as Lang, label: '🇺🇦 Українська' },
    { code: 'en' as Lang, label: '🇬🇧 English' },
    { code: 'es' as Lang, label: '🇪🇸 Español' },
  ];

  const title = lang === 'ua' ? story.title : lang === 'en' ? story.title_en : story.title_es;
  const content = lang === 'ua' ? story.content : lang === 'en' ? story.content_en : story.content_es;
  const moral = lang === 'ua' ? story.moral : lang === 'en' ? story.moral_en : story.moral_es;

  const moralLabel = lang === 'ua' ? '💡 Мораль казки:' : lang === 'en' ? '💡 Moral of the story:' : '💡 Moraleja:';

  if (!content) {
    return (
      <div className="lang-unavailable">
        <div className="lang-tabs">
          {langs.map(l => (
            <button
              key={l.code}
              className={`lang-tab ${lang === l.code ? 'lang-tab--active' : ''}`}
              onClick={() => setLang(l.code)}
            >{l.label}</button>
          ))}
        </div>
        <p style={{ textAlign: 'center', color: 'var(--gray-light)', padding: '2rem', fontFamily: 'sans-serif' }}>
          Переклад недоступний для цієї казки 🌙
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="lang-tabs">
        {langs.map(l => (
          <button
            key={l.code}
            className={`lang-tab ${lang === l.code ? 'lang-tab--active' : ''}`}
            onClick={() => setLang(l.code)}
          >{l.label}</button>
        ))}
      </div>

      <h1 className="story-title" style={{ marginTop: '1.5rem' }}>{title}</h1>

      <p className="story-text">{content}</p>

      {moral && (
        <div className="story-moral">
          <strong>{moralLabel}</strong>
          <p>{moral}</p>
        </div>
      )}
    </div>
  );
}
