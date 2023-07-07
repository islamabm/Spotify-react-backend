const axios = require('axios')

async function identifySong(data) {
  const options = {
    method: 'GET',
    url: 'https://shazam.p.rapidapi.com/shazam-events/list',
    params: data,
    headers: {
      'X-RapidAPI-Key': 'd1c1bad93emsh030a132b1d78a4ap1a3edcjsn7e736b8942c1',
      'X-RapidAPI-Host': 'shazam.p.rapidapi.com',
    },
  }
  try {
    const response = await axios.request(options)
    if (response.status === 200) {
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
