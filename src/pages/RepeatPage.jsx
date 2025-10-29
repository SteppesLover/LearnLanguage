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

function RepeatPage({ dailyLimit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [repeatedToday, setRepeatedToday] = useState(0);
  const [error, setError] = useState(null); 

  const findRecordByWordId = useCallback(async (wordId) => {
    try {
      const filter = encodeURIComponent(`{wordId} = ${wordId}`);
      const url = `${BASE_URL}?filterByFormula=${filter}`;
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return data.records?.[0] || null;
    } catch (err) {
      setError('Failed to find word record in Airtable.');
      console.error(err);
      return null;
    }
  }, []);

  const markWordUsedToday = useCallback(async (wordId) => {
    try {
      const record = await findRecordByWordId(wordId);
      if (!record) return;

      const res = await fetch(`${BASE_URL}/${record.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          fields: { isUsedToday: true },
        }),
      });
      if (!res.ok) throw new Error(`Failed to update record: ${res.status}`);
    } catch (err) {
      setError('Failed to mark word as used today.');
      console.error(err);
    }
  }, [findRecordByWordId]);

  const updateProgress = useCallback((wordId, isKnown) => {
    if (!isKnown) return;

    const today = new Date().toISOString().split('T')[0];
    const progress = JSON.parse(localStorage.getItem('dailyProgress')) || {};
    const todayProgress = new Set(progress[today] || []);

    todayProgress.add(wordId);
    progress[today] = Array.from(todayProgress);

    localStorage.setItem('dailyProgress', JSON.stringify(progress));
    setRepeatedToday(todayProgress.size);
  }, []);

  const goToNextWord = useCallback(() => {
    setShuffledWords((prev) => {
      const next = [...prev];
      next.splice(currentIndex, 1);
      return next;
    });
    setCurrentIndex(0);
  }, [currentIndex]);

  const handleKnown = useCallback(async () => {
    if (!shuffledWords[currentIndex]) return;
    const wordId = shuffledWords[currentIndex].id;
    try {
      await handleWordProgress(wordId, true);
      updateProgress(wordId, true);
      await markWordUsedToday(wordId);
      goToNextWord();
      setError(null);
    } catch (err) {
      setError('Error occurred while processing known word.');
      console.error(err);
    }
  }, [shuffledWords, currentIndex, updateProgress, markWordUsedToday, goToNextWord]);

  const handleUnknown = useCallback(async () => {
    if (!shuffledWords[currentIndex]) return;
    const wordId = shuffledWords[currentIndex].id;
    try {
      await handleWordProgress(wordId, false);
      await markWordUsedToday(wordId);
      goToNextWord();
      setError(null);
    } catch (err) {
      setError('Error occurred while processing unknown word.');
      console.error(err);
    }
  }, [shuffledWords, currentIndex, markWordUsedToday, goToNextWord]);

  useEffect(() => {
    let isMounted = true;

    async function loadWords() {
      try {
        setError(null);
        const res = await fetch(BASE_URL, { headers });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        const learningIds = data.records
          .filter((r) => r.fields.status === 'learning' && !r.fields.isUsedToday)
          .map((r) => r.fields.wordId);

        const filtered = words.filter((w) => learningIds.includes(w.id));
        const shuffled = [...filtered].sort(() => 0.5 - Math.random());

        if (isMounted) setShuffledWords(shuffled);
      } catch (err) {
        setError('Failed to fetch words from Airtable.');
        console.error(err);
        if (isMounted) setShuffledWords([]);
      }
    }

    loadWords();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const storedProgress = JSON.parse(localStorage.getItem('dailyProgress')) || {};
    const today = new Date().toISOString().split('T')[0];
    const todayProgress = storedProgress[today] || [];
    setRepeatedToday(todayProgress.length);
  }, []);

  const currentWord = shuffledWords[currentIndex];

  if (error) {
    return (
      <Layout>
        <h2>Repeat Practice</h2>
        <p style={{ color: 'red' }}>{error}</p>
      </Layout>
    );
  }

  if (repeatedToday >= dailyLimit) {
    return (
      <Layout>
        <h2>Repeat Practice</h2>
        <p>You’ve reached your daily limit of {dailyLimit} repetitions.</p>
        <DailyProgress repeated={repeatedToday} dailyLimit={dailyLimit} />
      </Layout>
    );
  }

  if (shuffledWords.length === 0 || !currentWord) {
    return (
      <Layout>
        <h2>Repeat Practice</h2>
        <p>You’ve repeated all available words for today!</p>
        <DailyProgress repeated={repeatedToday} dailyLimit={dailyLimit} />
      </Layout>
    );
  }

  return (
    <Layout>
      <h2>Repeat Practice</h2>
      <DailyProgress repeated={repeatedToday} dailyLimit={dailyLimit} />
      <Flashcard word={currentWord} />
      <div>
        <button onClick={handleKnown}>I Know</button>
        <button onClick={handleUnknown}>I Don't Know</button>
      </div>
    </Layout>
  );
}

export default RepeatPage;
