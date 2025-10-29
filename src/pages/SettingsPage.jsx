import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import save_data from '../assets/icons/save_data.svg';
import ResetProgressButton from '../shared/ResetProgressButton';
import AddWordForm from '../shared/AddWordForm';

function SettingsPage({ dailyLimit, setDailyLimit }) {
  const [inputValue, setInputValue] = useState(dailyLimit);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validate = (value) => {
    const num = parseInt(value);
    if (isNaN(num) || num <= 0) {
      setError('Daily limit must be a number greater than 0');
      return false;
    } else {
      setError('');
      return true;
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
    validate(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate(inputValue)) {
      const newLimit = parseInt(inputValue);
      setDailyLimit(newLimit);
      localStorage.setItem('dailyLimit', newLimit);
      navigate('/');
    }
  };

  return (
    <div className="settings-page" style={{ padding: '2rem' }}>
      <h2>Settings</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}
      >
        <label>
          Daily Repeat Limit:
          <input
            type="number"
            value={inputValue}
            onChange={handleChange}
            min="1"
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          />
        </label>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button
          type="submit"
          disabled={!!error}
          style={{
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: 'center',
            opacity: error ? 0.6 : 1,
            cursor: error ? 'not-allowed' : 'pointer',
          }}
        >
          <img src={save_data} alt="save" width={20} height={20} />
          Save
        </button>
      </form>

      <div style={{ marginTop: '2rem' }}>
        <ResetProgressButton onResetComplete={() => console.log('Progress reset complete')} />
      </div>

      <AddWordForm onWordAdded={(word) => console.log('Added word:', word)} />
    </div>
  );
}

export default SettingsPage;