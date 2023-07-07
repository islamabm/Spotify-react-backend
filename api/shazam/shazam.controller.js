const shazamService = require('./shazam.service')
// const stationService = require('./station.service.js')
async function getSong(req, res) {
  const data = req.body
  const song = await shazamService.identifySong(data)
  res.send(song)
}

module.exports = {
  getSong,
}
