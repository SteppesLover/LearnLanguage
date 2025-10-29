import { useState, useEffect } from 'react';
import pen from '../assets/icons/pen.svg';
import eye from '../assets/icons/eye.svg';

function Flashcard({ word }) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    setShowTranslation(false);
    setShowInput(false);
    setUserInput('');
    setIsCorrect(null);
  }, [word]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);
    setIsCorrect(value.trim().toLowerCase() === word.en.toLowerCase());
  };

  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '12px',
        padding: '1rem',
        maxWidth: '320px',
        userSelect: 'none',
        textAlign: 'center',
        margin: '1rem auto',
      }}
    >
      <h3>{word.en}</h3>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setShowTranslation(true)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <img src={eye} alt="Show Translation" width={28} height={28} />
        </button>
        <button
          onClick={() => setShowInput(true)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <img src={pen} alt="Show Input" width={28} height={28} />
        </button>
      </div>

      {showTranslation && (
        <>
          <p style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>{word.ru}</p>
          <small>{word.tr}</small>
        </>
      )}

      {showInput && (
        <div style={{ marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="Type the English word"
            value={userInput}
            onChange={handleInputChange}
            style={{
              padding: '0.4rem 0.6rem',
              fontSize: '1rem',
              borderRadius: '6px',
              border: '1px solid #aaa',
              outline:
                isCorrect === null
                  ? 'none'
                  : isCorrect
                  ? '2px solid green'
                  : '2px solid red',
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Flashcard;