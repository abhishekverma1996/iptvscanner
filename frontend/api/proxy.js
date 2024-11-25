const axios = require('axios');

exports.handler = async (event, context) => {
  const { username, password, panel, action } = event.queryStringParameters;

  if (!username || !password || !panel || !action) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required parameters.' }),
    };
  }

  try {
    // Construct the URL based on the action
    let url = '';
    if (action === 'get_m3u') {
      // For XStreamToM3u, get the M3U link
      url = `${panel}/get.php?username=${username}&password=${password}&type=m3u`;
    } else if (action === 'get_categories') {
      // If action is to get live categories
      url = `${panel}/player_api.php?username=${username}&password=${password}&action=get_live_categories`;
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid action.' }),
      };
    }

    // Make the request to the panel's URL
    const response = await axios.get(url, {
      timeout: 5000, // Timeout after 5 seconds
    });

    // Return the response data back to the client
    if (action === 'get_m3u') {
      // For M3U action, return the m3u link
      return {
        statusCode: 200,
        body: JSON.stringify({
          m3uLink: response.data, // M3U content returned from the panel
        }),
      };
    } else if (action === 'get_categories') {
      // If categories are fetched, return them
      return {
        statusCode: 200,
        body: JSON.stringify(response.data),
      };
    }
  } catch (error) {
    console.error('Error making request to panel:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data from panel.' }),
    };
  }
};
