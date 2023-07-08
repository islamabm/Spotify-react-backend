const multer = require('multer')
const upload = multer()
const shazamService = require('./shazam.service')

async function getSong(req, res) {
  const data = req.file
  const song = await shazamService.identifySong(data)
  res.send(song)
}

module.exports = {
  getSong,
}
