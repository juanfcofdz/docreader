exports.handler = async (event) => {
  const key = process.env.ELEVENLABS_API_KEY;
  const trimmedKey = key ? key.trim() : null;

  let elevenLabsStatus = null;
  let elevenLabsBody = null;

  if (trimmedKey) {
    try {
      const res = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: { 'xi-api-key': trimmedKey }
      });
      elevenLabsStatus = res.status;
      elevenLabsBody = await res.text();
      elevenLabsBody = elevenLabsBody.slice(0, 200); // solo primeros 200 chars
    } catch (e) {
      elevenLabsBody = e.message;
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hasKey: !!key,
      keyLength: key ? key.length : 0,
      trimmedKeyLength: trimmedKey ? trimmedKey.length : 0,
      keyPrefix: trimmedKey ? trimmedKey.slice(0, 5) : null,
      elevenLabsStatus,
      elevenLabsBody
    })
  };
};
