import React, { useState } from 'react';

const ResetProgressButton = ({ onResetComplete, style, ...rest }) => {
  const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
  const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
  const TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME;

  const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;
  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  };

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
        if (!patchRes.ok)
          throw new Error(`Failed to reset record ${record.id}: ${patchRes.status}`);
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
    setSuccess(false);
    await resetAllIsUsedToday();

    if (!error) {
      setSuccess(true);
      if (onResetComplete) onResetComplete(); // уведомляем родителя, чтобы он обновил стейт
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
        {loading ? 'Resetting...' : 'Reset Daily Progress'}
      </button>

      {error && <div style={{ color: 'red', marginTop: '0.5rem' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: '0.5rem' }}>Progress reset!</div>}
    </div>
  );
};

export default ResetProgressButton;
