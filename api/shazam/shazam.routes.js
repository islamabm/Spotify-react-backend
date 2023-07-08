const express = require('express')
const { getSong } = require('./shazam.controller')
const router = express.Router()
const multer = require('multer')
const upload = multer()

router.post('/identify', upload.single('file'), getSong)

module.exports = router
