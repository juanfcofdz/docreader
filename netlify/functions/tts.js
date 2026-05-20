exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY;

  if (!ELEVENLABS_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'ELEVENLABS_API_KEY not configured' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { text, voiceId } = body;
  if (!text || !voiceId) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing text or voiceId' }) };
  }

  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
      })
    });

    if (!res.ok) {
      const err = await res.text();
      return { statusCode: res.status, body: JSON.stringify({ error: err }) };
    }

    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'audio/mpeg' },
      body: base64,
      isBase64Encoded: true
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
