const axios = require('axios');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { text } = JSON.parse(event.body);

    // TODO: Replace with actual ChatGPT API call
    const response = {
      parsed_data: {
        tenant: "Example Tenant",
        landlord: "Example Landlord",
        lease_term: "5 years",
        rent: "$5000 per month"
      }
    };

    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } catch (error) {
    return { statusCode: 500, body: 'Internal Server Error: ' + error.message };
  }
};