const axios = require('axios');

exports.handler = async (event, context) => {
  const { username, password, panel, action } = event.queryStringParameters;

  if (!username || !password || !panel || !action) {
    console.error('Missing parameters:', { username, password, panel, action });
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required parameters.' }),
    };
  }

  try {
    let url = '';
    if (action === 'get_m3u') {
      url = `${panel}/get.php?username=${username}&password=${password}&type=m3u`;
    } else if (action === 'get_categories') {
      url = `${panel}/player_api.php?username=${username}&password=${password}&action=get_live_categories`;
    } else {
      console.error('Invalid action:', action);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid action.' }),
      };
    }

    // Log the final URL being requested
    console.log('Requesting URL:', url);

    const response = await axios.get(url, { timeout: 5000 });

    // Log the response
    console.log('Response from panel:', response.data);

    if (action === 'get_m3u') {
      return {
        statusCode: 200,
        body: JSON.stringify({ m3uLink: response.data }),
      };
    } else if (action === 'get_categories') {
      return {
        statusCode: 200,
        body: JSON.stringify(response.data),
      };
    }
  } catch (error) {
    console.error('Error making request to panel:', error);

    // Check if the error is a network error or response error
    if (error.response) {
      // Response error (non-2xx status code)
      console.error('Response error:', error.response.data);
      return {
        statusCode: error.response.status || 500,
        body: JSON.stringify({ error: error.response.data || 'Failed to fetch data from panel.' }),
      };
    } else if (error.request) {
      // Network error (request made, but no response)
      console.error('Network error:', error.request);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Network error. Unable to reach the panel.' }),
      };
    } else {
      // Unknown error
      console.error('Unexpected error:', error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Unexpected error occurred.' }),
      };
    }
  }
};
