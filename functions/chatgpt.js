const axios = require('axios');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const { text } = JSON.parse(event.body);

  if (!process.env.OPENAI_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'OpenAI API key is not set' }) };
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [
          {role: "system", content: "You are a helpful assistant that extracts key information from commercial lease documents. Your output should be a valid JSON object with specific keys."},
          {role: "user", content: `Extract the following information from this lease document and format it as a JSON object with these exact keys: commencementDate, expirationDate, rentPaymentSchedule, rentDueDate, deposit, propertyAddress, squareFootage, lesseeName, lesseeMailingAddress, parking, maintenanceHVACCAM, insuranceRequirements, renewal, nextMonthlyRentAmount, nextRentDueDate. If any information is not found, use "Not specified" as the value. Here's the lease text:\n\n${text}`}
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const parsedData = JSON.parse(response.data.choices[0].message.content);

    return {
      statusCode: 200,
      body: JSON.stringify({ parsed_data: parsedData })
    };
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    return { 
      statusCode: 500, 
      body: JSON.stringify({
        error: 'Failed to process the lease',
        details: error.response ? error.response.data : error.message
      })
    };
  }
};