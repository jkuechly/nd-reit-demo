const axios = require('axios');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { text } = JSON.parse(event.body);
  const openaiApiKey = process.env.OPENAI_API_KEY;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [
          {role: "system", content: "You are a helpful assistant that parses commercial lease information."},
          {role: "user", content: `Parse the following lease text and extract key information such as tenant, landlord, lease term, and rent: ${text}`}
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${sk-proj-ddfZ7m7rziQGwjMziUGuT3BlbkFJShE1Kd8rhl979F4LuEVv}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const parsedData = response.data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ parsed_data: parsedData })
    };
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    return { 
      statusCode: 500, 
      body: JSON.stringify({error: 'Failed to process the lease'})
    };
  }
};