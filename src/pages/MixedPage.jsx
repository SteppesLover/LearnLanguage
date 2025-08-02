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

function MixedPage({ dailyLimit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [repeatedToday, setRepeatedToday] = useState(0);

  useEffect(() => {
    async function loadWords() {
      try {
        const res = await fetch(BASE_URL, { headers });
        const data = await res.json();

        const learnedIds = data.records
          .filter((record) => record.fields.status === 'learned')
          .map((record) => record.fields.wordId);

        const filtered = words.filter(
          (word) => !learnedIds.includes(word.id)
        );

        const shuffled = [...filtered].sort(() => 0.5 - Math.random());
        setShuffledWords(shuffled);
      } catch (err) {
        console.error('Failed to fetch learned words:', err);
        setShuffledWords([...words].sort(() => 0.5 - Math.random()));
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
    setCurrentIndex(prev =>
      prev + 1 < shuffledWords.length ? prev + 1 : 0
    );
  };

  const handleKnown = async () => {
    const wordId = shuffledWords[currentIndex].id;
    await handleWordProgress(wordId, true);
    updateProgress(wordId, true);
    goToNextWord();
  };

  const handleUnknown = async () => {
    const wordId = shuffledWords[currentIndex].id;
    await handleWordProgress(wordId, false);
    goToNextWord();
  };

  const currentWord = shuffledWords[currentIndex];

  if (repeatedToday >= dailyLimit) {
    return (
      <div>
        <h2>Mixed Practice</h2>
        <p>You’ve reached your daily limit of {dailyLimit} repetitions.</p>
        <DailyProgress repeated={repeatedToday} dailyLimit={dailyLimit} />
      </div>
    );
  }

  if (!currentWord) return <p>Loading...</p>;

  return (
    <div>
      <h2>Mixed Practice</h2>
      <DailyProgress repeated={repeatedToday} dailyLimit={dailyLimit} />
      <Flashcard word={currentWord} />
      <div>
        <button onClick={handleKnown}>I Know</button>
        <button onClick={handleUnknown}>I Don't Know</button>
      </div>
    </div>
  );
}

export default MixedPage;