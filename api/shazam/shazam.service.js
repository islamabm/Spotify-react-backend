const axios = require('axios')
const FormData = require('form-data')
const { Readable } = require('stream')
const ffmpeg = require('fluent-ffmpeg')
require('dotenv').config()

async function identifySong(audioData) {
  // Convert webm to mp3
  const inputStream = new Readable()
  inputStream.push(audioData.buffer)
  inputStream.push(null)

  let mp3Data = []
  const converter = ffmpeg(inputStream)
    .inputFormat('webm')
    .outputFormat('mp3')
    .on('error', console.error)
    .on('data', (chunk) => {
      mp3Data.push(chunk)
    })

  await new Promise((resolve, reject) => {
    converter.on('end', resolve).on('error', reject).run()
  })

  mp3Data = Buffer.concat(mp3Data)

  // Create a Readable stream from the mp3 Buffer
  const stream = new Readable()
  console.log('Type of mp3Data: ', typeof mp3Data)

  stream.push(mp3Data)
  stream.push(null)

  // Append the stream to form data
  const formData = new FormData()
  formData.append('file', stream, {
    filename: 'recordedAudio.mp3', // Make sure this is an actual mp3 file
    contentType: 'audio/mpeg', // Use the correct MIME type for mp3
  })

  const options = {
    method: 'POST',
    url: 'https://music-identify.p.rapidapi.com/identify',
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'music-identify.p.rapidapi.com',
      ...formData.getHeaders(),
    },
    data: formData,
  }
  try {
    const response = await axios.request(options)
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  identifySong,
}
