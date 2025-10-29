import { useState, useEffect, useCallback } from 'react';
import { handleWordProgress } from '../features/ProgressProcessor';
import Flashcard from '../shared/Flashcard';
import DailyProgress from '../features/DailyProgress';
import words from '../assets/words.json';
import Layout from '../shared/Layout';

const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME;

const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;
const headers = {
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
};

function MixedPage({ dailyLimit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [repeatedToday, setRepeatedToday] = useState(0);
  const [error, setError] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const fetchLearnedIds = useCallback(async () => {
    try {
      const res = await fetch(BASE_URL, { headers });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data.records
        .filter((r) => r.fields.status === 'learned')
        .map((r) => r.fields.wordId);
    } catch (err) {
      console.error('Failed to fetch from Airtable:', err);
      setError('Failed to load words data. Please try again later.');
      return [];
    }
  }, []);

  const shuffle = useCallback((arr) => {
    return [...arr].sort(() => 0.5 - Math.random());
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadWords = async () => {
      setError(null);
      const learnedIds = await fetchLearnedIds();
      if (!isMounted) return;

      const filtered = words.filter((word) => !learnedIds.includes(word.id));
      const shuffled = shuffle(filtered);
      setShuffledWords(shuffled);
    };

    loadWords();

    return () => {
      isMounted = false;
    };
  }, [fetchLearnedIds, shuffle]);

  useEffect(() => {
    const storedProgress = JSON.parse(localStorage.getItem('dailyProgress')) || {};
    const todayProgress = storedProgress[today] || [];
    setRepeatedToday(todayProgress.length);
  }, [today]);

  const updateProgress = useCallback((wordId) => {
    const progress = JSON.parse(localStorage.getItem('dailyProgress')) || {};
    const todayProgress = new Set(progress[today] || []);
    todayProgress.add(wordId);
    progress[today] = Array.from(todayProgress);
    localStorage.setItem('dailyProgress', JSON.stringify(progress));
    setRepeatedToday(todayProgress.size);
  }, [today]);

  const goToNextWord = useCallback(() => {
    setCurrentIndex((prev) =>
      prev + 1 < shuffledWords.length ? prev + 1 : 0
    );
  }, [shuffledWords]);

  const handleKnown = useCallback(async () => {
    const wordId = shuffledWords[currentIndex]?.id;
    if (!wordId) return;
    await handleWordProgress(wordId, true);
    updateProgress(wordId);
    goToNextWord();
  }, [shuffledWords, currentIndex, updateProgress, goToNextWord]);

  const handleUnknown = useCallback(async () => {
    const wordId = shuffledWords[currentIndex]?.id;
    if (!wordId) return;
    await handleWordProgress(wordId, false);
    goToNextWord();
  }, [shuffledWords, currentIndex, goToNextWord]);

  const currentWord = shuffledWords[currentIndex];

  if (error) {
    return (
      <Layout>
        <h2>Mixed Practice</h2>
        <p style={{ color: 'red' }}>{error}</p>
      </Layout>
    );
  }

  if (repeatedToday >= dailyLimit) {
    return (
      <Layout>
        <h2>Mixed Practice</h2>
        <p>You’ve reached your daily limit of {dailyLimit} repetitions.</p>
        <DailyProgress repeated={repeatedToday} dailyLimit={dailyLimit} />
      </Layout>
    );
  }

  if (!currentWord) return <p>Loading...</p>;

  return (
    <Layout>
      <h2>Mixed Practice</h2>
      <DailyProgress repeated={repeatedToday} dailyLimit={dailyLimit} />
      <Flashcard word={currentWord} />
      <div>
        <button onClick={handleKnown}>I Know</button>
        <button onClick={handleUnknown}>I Don't Know</button>
      </div>
    </Layout>
  );
}

export default MixedPage;