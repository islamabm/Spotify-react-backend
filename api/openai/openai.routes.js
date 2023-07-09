const express = require('express')
const { generateImage } = require('./openai.controller')
const router = express.Router()

router.post('/generate-image', generateImage)

module.exports = router
