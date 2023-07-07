const express = require('express')
const { getSong } = require('./shazam.controller')
const router = express.Router()

router.post('/identify', getSong)

module.exports = router
