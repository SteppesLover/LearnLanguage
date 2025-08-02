import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import save_data from '../assets/icons/save_data.svg';
import repeat from '../assets/icons/repeat.svg';

function ResetProgressButton({ style, ...rest }) {
  const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
  const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
  const TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME;

  const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;
  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  };

  async function resetAllIsUsedToday() {
    try {
      const res = await fetch(BASE_URL, { headers });
      const data = await res.json();
      const recordsToReset = data.records.filter(r => r.fields.isUsedToday);

      for (const record of recordsToReset) {
        await fetch(`${BASE_URL}/${record.id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            fields: { isUsedToday: false },
          }),
        });
      }
    } catch (err) {
      console.error('Failed to reset isUsedToday:', err);
    }
  }

  const handleReset = async () => {
    localStorage.removeItem('dailyProgress');
    await resetAllIsUsedToday();
    alert('Daily progress reset!');
    window.location.reload();
  };

  return (
        <button
          onClick={handleReset}
          type="submit"
          style={{
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: 'center',
            width: '20', 
            height: '20', 
          }}
        >
          Reset Daily Progress
    </button>
  );
}

function SettingsPage({ dailyLimit, setDailyLimit }) {
  const [inputValue, setInputValue] = useState(dailyLimit);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLimit = parseInt(inputValue);
    if (!isNaN(newLimit) && newLimit > 0) {
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
            onChange={(e) => setInputValue(e.target.value)}
            min="1"
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          />
        </label>
        <button
          type="submit"
          style={{
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: 'center',
          }}
        >
          <img src={save_data} alt="save" width={20} height={20} />
          Save
        </button>
      </form>
      <ResetProgressButton/>
    </div>
  );
}

export default SettingsPage;