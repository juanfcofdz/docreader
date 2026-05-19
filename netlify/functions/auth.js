exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const APP_PASSWORD = process.env.APP_PASSWORD;
  if (!APP_PASSWORD) {
    return { statusCode: 500, body: JSON.stringify({ error: 'APP_PASSWORD not configured' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  if (body.password === APP_PASSWORD) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true })
    };
  }

  return {
    statusCode: 401,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: 'Unauthorized' })
  };
};
