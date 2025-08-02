import { useState, useEffect } from 'react';
import { handleWordProgress } from '../features/ProgressProcessor';
import Flashcard from '../features/Flashcard';
import DailyProgress from '../features/DailyProgress';
import words from '../assets/words.json';

const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME;

const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;
const headers = {
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
};

function RepeatPage({ dailyLimit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [repeatedToday, setRepeatedToday] = useState(0);

  async function findRecordByWordId(wordId) {
    const filter = encodeURIComponent(`{wordId} = ${wordId}`);
    const url = `${BASE_URL}?filterByFormula=${filter}`;
    const res = await fetch(url, { headers });
    const data = await res.json();
    return data.records?.[0] || null;
  }

  async function markWordUsedToday(wordId) {
    const record = await findRecordByWordId(wordId);
    if (!record) return;

    await fetch(`${BASE_URL}/${record.id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        fields: { isUsedToday: true },
      }),
    });
  }

  useEffect(() => {
    async function loadWords() {
      try {
        const res = await fetch(BASE_URL, { headers });
        const data = await res.json();

        const learningIds = data.records
          .filter((r) => r.fields.status === 'learning' && !r.fields.isUsedToday)
          .map((r) => r.fields.wordId);

        const filtered = words.filter((w) => learningIds.includes(w.id));
        const shuffled = [...filtered].sort(() => 0.5 - Math.random());

        setShuffledWords(shuffled);
      } catch (err) {
        console.error('Failed to fetch words:', err);
        setShuffledWords([]);
      }
    }

    loadWords();
  }, []);

  useEffect(() => {
    const storedProgress = JSON.parse(localStorage.getItem('dailyProgress')) || {};
    const today = new Date().toISOString().split('T')[0];
    const todayProgress = storedProgress[today] || [];
    setRepeatedToday(todayProgress.length);
  }, []);

  const updateProgress = (wordId, isKnown) => {
    if (!isKnown) return;

    const today = new Date().toISOString().split('T')[0];
    const progress = JSON.parse(localStorage.getItem('dailyProgress')) || {};
    const todayProgress = new Set(progress[today] || []);

    todayProgress.add(wordId);
    progress[today] = Array.from(todayProgress);

    localStorage.setItem('dailyProgress', JSON.stringify(progress));
    setRepeatedToday(todayProgress.size);
  };

  const goToNextWord = () => {
    setShuffledWords(prev => {
      const next = [...prev];
      next.splice(currentIndex, 1);
      return next;
    });
    setCurrentIndex(0);
  };

  const handleKnown = async () => {
    const wordId = shuffledWords[currentIndex].id;
    await handleWordProgress(wordId, true);
    updateProgress(wordId, true);
    await markWordUsedToday(wordId);
    goToNextWord();
  };

  const handleUnknown = async () => {
    const wordId = shuffledWords[currentIndex].id;
    await handleWordProgress(wordId, false);
    await markWordUsedToday(wordId);
    goToNextWord();
  };

  const currentWord = shuffledWords[currentIndex];

  if (repeatedToday >= dailyLimit) {
    return (
      <div>
        <h2>Repeat Practice</h2>
        <p>You’ve reached your daily limit of {dailyLimit} repetitions.</p>
        <DailyProgress repeated={repeatedToday} dailyLimit={dailyLimit} />
      </div>
    );
  }

  if (shuffledWords.length === 0 || !currentWord) {
    return (
      <div>
        <h2>Repeat Practice</h2>
        <p>You’ve repeated all available words for today!</p>
        <DailyProgress repeated={repeatedToday} dailyLimit={dailyLimit} />
      </div>
    );
  }

  return (
    <div>
      <h2>Repeat Practice</h2>
      <DailyProgress repeated={repeatedToday} dailyLimit={dailyLimit} />
      <Flashcard word={currentWord} />
      <div>
        <button onClick={handleKnown}>I Know</button>
        <button onClick={handleUnknown}>I Don't Know</button>
      </div>
    </div>
  );
}

export default RepeatPage;
