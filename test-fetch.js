async function testFetch() {
  console.log('--- NODE FETCH TEST ---');
  try {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      }
    });
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Models found:', data.data ? data.data.length : 'N/A');
  } catch (err) {
    console.error('FETCH FAILED:', err);
  }
}

testFetch();
