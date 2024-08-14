const axios = require('axios');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { text } = JSON.parse(event.body);

  // Check if the API key is set
  if (!process.env.OPENAI_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({error: 'OpenAI API key is not set'}) };
  }

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
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
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