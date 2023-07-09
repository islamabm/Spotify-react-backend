const axios = require('axios')
require('dotenv').config()

const API_IMAGE_URL = 'https://api.deepai.org/api/text2img'
const API_KEY = process.env.REACT_APP_AI_IMAGE

async function generateImageFromText(prompt) {
  try {
    const formData = new FormData()
    formData.append('text', prompt)

    const response = await axios.post(API_IMAGE_URL, formData, {
      headers: { 'api-key': API_KEY },
    })

    return response.data.output_url
  } catch (error) {
    console.error(`Error generating image: ${error}`)
    throw error
  }
}

module.exports = {
  generateImageFromText,
}
