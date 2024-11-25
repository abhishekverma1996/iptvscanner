const axios = require('axios');

// Define the handler function
module.exports = async (req, res) => {
  const { username, password, panel } = req.query; // Access query parameters

  // Check if parameters are missing
  if (!username || !password || !panel) {
    console.error('Missing parameters:', { username, password, panel });
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  try {
    // Construct the URL to request data from the panel
    const url = `${panel}/get.php?username=${username}&password=${password}&type=m3u`;

    // Log the full URL to confirm it's being built correctly
    console.log('Requesting URL:', url);

    // Make the request to the panel
    const response = await axios.get(url, { timeout: 5000 });

    // Log the response
    console.log('Response from panel:', response.data);

    // Return the response data as needed
    return res.status(200).json({ m3uLink: response.data });
  } catch (error) {
    console.error('Error making request to panel:', error);

    // Check if the error is a network error or response error
    if (error.response) {
      // Response error (non-2xx status code)
      console.error('Response error:', error.response.data);
      return res.status(error.response.status || 500).json({ error: error.response.data || 'Failed to fetch data from panel.' });
    } else if (error.request) {
      // Network error (request made, but no response)
      console.error('Network error:', error.request);
      return res.status(500).json({ error: 'Network error. Unable to reach the panel.' });
    } else {
      // Unknown error
      console.error('Unexpected error:', error.message);
      return res.status(500).json({ error: 'Unexpected error occurred.' });
    }
  }
};
