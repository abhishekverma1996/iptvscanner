const axios = require('axios');

// Define the handler function
module.exports = async (req, res) => {
  const { username, password, panel, action } = req.query; // Access query parameters

  // Check if parameters are missing
  if (!username || !password || !panel || !action) {
    console.error('Missing parameters:', { username, password, panel, action });
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

    // Check the action to decide how to respond
    if (action === 'get_m3u') {
      // Set headers for file download (forcing the browser to download the file)
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');  // Set the content type as m3u
      res.setHeader('Content-Disposition', 'attachment; filename=panelname.m3u');  // Provide the file name

      // Send the raw M3U data as the file content
      return res.send(response.data);
    } else {
      return res.status(400).json({ error: 'Unknown action.' });
    }
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
