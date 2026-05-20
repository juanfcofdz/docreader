exports.handler = async (event) => {
  const key = process.env.ELEVENLABS_API_KEY;
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hasKey: !!key,
      keyLength: key ? key.length : 0,
      keyPrefix: key ? key.slice(0, 5) : null,
      nodeVersion: process.version
    })
  };
};
