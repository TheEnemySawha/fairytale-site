'use client';

import { useState, useEffect } from 'react';

export default function StarRating({ storyId }: { storyId: number }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [avg, setAvg] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const rated = localStorage.getItem(`rated_${storyId}`);
    if (rated) {
      setSubmitted(true);
      setUserRating(Number(rated));
    }
    fetch(`/api/ratings?story_id=${storyId}`)
      .then(r => r.json())
      .then(d => { setAvg(d.avg); setCount(d.count); });
  }, [storyId]);

  async function handleRate(stars: number) {
    if (submitted || loading) return;
    setLoading(true);
    const res = await fetch('/api/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ story_id: storyId, stars }),
    });
    if (res.ok) {
      localStorage.setItem(`rated_${storyId}`, String(stars));
      setSubmitted(true);
      setUserRating(stars);
      const d = await res.json();
      setAvg(d.avg);
      setCount(d.count);
    }
    setLoading(false);
  }

  const display = hovered ?? userRating ?? Math.round(avg ?? 0);

  return (
    <div className="star-rating">
      <p className="star-label">
        {submitted ? '✨ Дякуємо за оцінку!' : 'Як тобі казка?'}
      </p>
      <div className="stars">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            className={`star ${n <= display ? 'star--on' : ''} ${submitted ? 'star--done' : ''}`}
            onClick={() => handleRate(n)}
            onMouseEnter={() => !submitted && setHovered(n)}
            onMouseLeave={() => setHovered(null)}
            disabled={submitted || loading}
            aria-label={`${n} зірок`}
          >★</button>
        ))}
      </div>
      {avg !== null && count > 0 && (
        <p className="star-avg">{avg.toFixed(1)} ★ · {count} {count === 1 ? 'оцінка' : count < 5 ? 'оцінки' : 'оцінок'}</p>
      )}
    </div>
  );
}
