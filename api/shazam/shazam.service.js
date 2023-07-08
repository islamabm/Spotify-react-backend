const axios = require('axios')
require('dotenv').config()
async function identifySong(
  artistId,
  language = 'en-US',
  fromDate = '2022-12-31',
  limit = '50',
  offset = '0'
) {
  const options = {
    method: 'GET',
    url: 'https://shazam.p.rapidapi.com/shazam-events/list',
    params: {
      artistId,
      l: language,
      from: fromDate,
      limit,
      offset,
    },
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'shazam.p.rapidapi.com',
    },
  }
  try {
    const response = await axios.request(options)
    if (response.status === 200) {
      console.log('response.data', response.data)
      return response.data
    } else {
      throw new Error(`Shazam API returned status ${response.status}`)
    }
  } catch (error) {
    console.error(`Error with Shazam API: ${error.message}`)
    throw error
  }
}

module.exports = {
  identifySong,
}
