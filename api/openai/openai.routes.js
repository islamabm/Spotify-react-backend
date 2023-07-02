const express = require('express')

const {
  generateSongs,
  getEmotion,
  generateStationName,
} = require('./openai.controller')
const router = express.Router()

router.get('/getEmotion', getEmotion)
router.post('/generateSongs', generateSongs)
router.post('/generateStationName', generateStationName)

module.exports = router
