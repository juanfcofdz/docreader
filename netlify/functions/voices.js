exports.handler = async (event) => {
  const APP_PASSWORD   = process.env.APP_PASSWORD;
  const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY;

  // Aceptar contraseña desde query param o header
  const providedPassword =
    event.queryStringParameters?.p ||
    event.headers['x-app-password'] ||
    event.headers['X-App-Password'];

  if (!APP_PASSWORD || providedPassword !== APP_PASSWORD) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

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
