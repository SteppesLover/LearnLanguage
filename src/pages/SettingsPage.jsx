import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import save_data from '../assets/icons/save_data.svg';

function ResetProgressButton({ style, ...rest }) {
  const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
  const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
  const TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME;

  const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;
  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  };

  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  async function resetAllIsUsedToday() {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch(BASE_URL, { headers });
      if (!res.ok) throw new Error(`Failed to fetch records: ${res.status}`);
      const data = await res.json();
      const recordsToReset = data.records.filter(r => r.fields.isUsedToday);

      for (const record of recordsToReset) {
        const patchRes = await fetch(`${BASE_URL}/${record.id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            fields: { isUsedToday: false },
          }),
        });
        if (!patchRes.ok) throw new Error(`Failed to reset record ${record.id}: ${patchRes.status}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to reset isUsedToday');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleReset = async () => {
    localStorage.removeItem('dailyProgress');
    await resetAllIsUsedToday();
    if (!error) {
      alert('Daily progress reset!');
      window.location.reload();
    }
  };

  return (
    <div>
      <button
        onClick={handleReset}
        type="button"
        disabled={loading}
        style={{
          padding: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          justifyContent: 'center',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          ...style,
        }}
        {...rest}
      >
        Reset Daily Progress
      </button>
      {error && <div style={{ color: 'red', marginTop: '0.5rem' }}>{error}</div>}
    </div>
  );
}

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
        <ResetProgressButton />
      </div>
    </div>
  );
}

export default SettingsPage;
