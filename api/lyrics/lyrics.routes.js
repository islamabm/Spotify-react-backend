const express = require('express')
const axios = require('axios')
const router = express.Router()

router.get('/:artist/:title', async (req, res) => {
  const { artist, title } = req.params
  const API_KEY = '84b68f966be64eb4fda0814cb1c0d00b'
  const url = `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${title}&q_artist=${artist}&apikey=${API_KEY}`

  try {
    const { data } = await axios.get(url)
    res.json(data.message.body.lyrics.lyrics_body)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching lyrics' })
  }
})

module.exports = router
