const axios = require('axios');

module.exports = async (req, res) => {
  const { username, password, panel, action } = req.query; // Access query parameters

  // Log the received parameters for debugging
  console.log('Received parameters:', { username, password, panel, action });

  // Check if required parameters are missing
  if (!username || !password || !panel) {
    console.error('Missing parameters:', { username, password, panel, action });
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  try {
    // Construct the URL to request data from the panel
    const url = `${panel}/get.php?username=${username}&password=${password}`;

    if (action === 'get_m3u') {
      // For M3U generation
      const m3uUrl = `${url}&type=m3u`;

      // Log the URL for M3U request
      console.log('Requesting M3U URL:', m3uUrl);

      // Make the request to the panel
      const response = await axios.get(m3uUrl, { timeout: 5000 });

      // Check if M3U data is returned and clean it
      if (response.data) {
        // Clean the M3U response to ensure proper format
        let cleanedM3U = response.data.replace(/\r\n/g, '\n'); // Remove any \r and ensure \n only
        cleanedM3U = cleanedM3U.replace(/^#EXTM3U\n/, ''); // Remove any extra #EXTM3U newline at the start
        cleanedM3U = '#EXTM3U\n' + cleanedM3U.trim(); // Ensure #EXTM3U is at the beginning without extra newlines

        // Return the cleaned M3U link data
        return res.status(200).json({ m3uLink: cleanedM3U });
      } else {
        return res.status(500).json({ error: 'M3U data not returned from panel.' });
      }
    } else if (action === 'get_live_categories') {
      // For getting live categories
      const categoryUrl = `${url}&action=get_live_categories`;

      // Log the URL for category request
      console.log('Requesting Category URL:', categoryUrl);

      // Make the request to fetch categories
      const response = await axios.get(categoryUrl, { timeout: 5000 });

      // Return category data
      return res.status(200).json(response.data);
    } else {
      return res.status(400).json({ error: 'Invalid action.' });
    }
  } catch (error) {
    console.error('Error:', error);

    // Check for response or network errors
    if (error.response) {
      return res.status(error.response.status || 500).json({ error: error.response.data || 'Failed to fetch data from panel.' });
    } else if (error.request) {
      return res.status(500).json({ error: 'Network error. Unable to reach the panel.' });
    } else {
      return res.status(500).json({ error: 'Unexpected error occurred.' });
    }
  }
};
