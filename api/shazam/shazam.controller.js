const multer = require('multer')
const upload = multer()
const shazamService = require('./shazam.service')

async function getSong(req, res) {
  const data = req.file
  try {
    const song = await shazamService.identifySong(data)
    res.send(song)
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Error identifying song' })
  }
}

module.exports = {
  getSong,
}
