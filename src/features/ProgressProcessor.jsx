const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME;

const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
};

export async function handleWordProgress(wordId, isKnown) {
  const existingRecord = await findRecordByWordId(wordId);

  if (!existingRecord) {
    const newStatus = isKnown ? 'learned' : 'learning';
    const repeatCount = isKnown ? 1 : 0;

    await fetch(BASE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        records: [
          {
            fields: {
              wordId,
              status: newStatus,
              repeatCount,
            },
          },
        ],
      }),
    });

    return;
  }

  const { id: recordId, fields } = existingRecord;
  let { status, repeatCount } = fields;

  if (status === 'learning' && isKnown) {
    repeatCount += 1;
    if (repeatCount >= 5) {
      status = 'learned';
    }
  }

  await fetch(`${BASE_URL}/${recordId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({
      fields: {
        status,
        repeatCount,
      },
    }),
  });
}

async function findRecordByWordId(wordId) {
  const filter = encodeURIComponent(`{wordId} = ${wordId}`);
  const url = `${BASE_URL}?filterByFormula=${filter}`;

  const res = await fetch(url, { headers });
  const data = await res.json();

  return data.records?.[0] || null;
}