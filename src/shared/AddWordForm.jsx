import React, { useState, useEffect } from 'react';
import wordsData from '../assets/words.json';

const AddWordForm = ({ onWordAdded }) => {
  const [en, setEn] = useState('');
  const [ru, setRu] = useState('');
  const [tr, setTr] = useState('');
  const [words, setWords] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // загружаем слова из json или localStorage
    const saved = JSON.parse(localStorage.getItem('words'));
    if (saved) {
      setWords(saved);
    } else {
      setWords(wordsData);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!en.trim() || !ru.trim()) {
      setMessage('Please fill English and Russian fields');
      return;
    }

    const maxId = words.length > 0 ? Math.max(...words.map(w => w.id)) : 0;
    const newWord = {
      id: maxId + 1,
      en: en.trim(),
      ru: ru.trim(),
      tr: tr.trim() || '',
    };

    const updated = [...words, newWord];
    setWords(updated);
    localStorage.setItem('words', JSON.stringify(updated));
    setMessage(`Word "${newWord.en}" added successfully!`);

    setEn('');
    setRu('');
    setTr('');

    if (onWordAdded) onWordAdded(newWord);
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Add New Word</h3>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxWidth: '300px',
        }}
      >
        <input
          type="text"
          placeholder="English word"
          value={en}
          onChange={(e) => setEn(e.target.value)}
          style={{ padding: '0.5rem' }}
        />
        <input
          type="text"
          placeholder="Russian translation"
          value={ru}
          onChange={(e) => setRu(e.target.value)}
          style={{ padding: '0.5rem' }}
        />
        <input
          type="text"
          placeholder="Transcription (optional)"
          value={tr}
          onChange={(e) => setTr(e.target.value)}
          style={{ padding: '0.5rem' }}
        />

        <button
          type="submit"
          style={{
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          Add Word
        </button>
      </form>

      {message && (
        <div
          style={{
            marginTop: '0.5rem',
            color: message.includes('successfully') ? 'green' : 'red',
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default AddWordForm;