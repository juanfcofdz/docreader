exports.handler = async (event) => {
  const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY;

  if (!ELEVENLABS_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'ELEVENLABS_API_KEY not configured' }) };
  }

  try {
    const res = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': ELEVENLABS_KEY }
    });

    if (!res.ok) {
      const err = await res.text();
      return { statusCode: res.status, body: JSON.stringify({ error: err }) };
    }

    const data = await res.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voices: data.voices })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
