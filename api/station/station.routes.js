const express = require('express')
const {
  requireAuth,
  requireAdmin,
} = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const {
  getStations,
  getStationById,
  addStation,
  updateStation,
  removeStation,
  addStationSong,
  removeStationSong,
  updateStationSongs,
} = require('./station.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getStations)
// router.get('/:category', log, getStations);
router.get('/:id', getStationById)
router.post('/', addStation)
router.put('/:id', updateStation)
router.put('/songs/:id', updateStationSongs)
router.delete('/:id', removeStation)
router.delete('/:id/song/:songId', removeStationSong)
// router.post('/', requireAuth, addStation)
// router.put('/:id', requireAuth, updateStation)
// router.delete('/:id', requireAuth, requireAdmin, removeStation)

router.post('/:id/song', addStationSong)
//Step 4

module.exports = router
