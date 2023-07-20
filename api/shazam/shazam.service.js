const axios = require('axios')
const FormData = require('form-data')
require('dotenv').config()

async function identifySong(audioData) {
  console.log('audioData:', audioData)
  try {
    const audioDataBase64 = Buffer.from(audioData.buffer).toString('base64')
    let response
    try {
      response = await axios({
        method: 'post',
        url: 'https://api.convertio.co/convert',
        headers: { 'Content-Type': 'application/json' },
        data: {
          apikey: process.env.REACT_APP_CONVERTIO_API_KEY,
          input: 'base64',
          file: audioDataBase64,
          filename: 'recordedAudio.webm',
          outputformat: 'mp3',
        },
      })
    } catch (err) {
      console.error('Error while sending POST request to Convertio:', err)
    }
    console.log('response:', response)
    let processId = response.data.data.id
    console.log('processId:', processId)

    let timer = setInterval(async () => {
      let jobResponse = await axios.get(
        `https://api.convertio.co/convert/${processId}/status`,
        {
          params: { apikey: process.env.REACT_APP_CONVERTIO_API_KEY },
        }
      )

      if (jobResponse.data.status === 'finished') {
        let downloadUrl = jobResponse.data.output.url
        let fileResponse = await axios.get(downloadUrl, {
          responseType: 'arraybuffer',
          transformResponse: [],
        })

        let mp3Data = new Uint8Array(fileResponse.data)
        clearInterval(timer)

        let songFormData = new FormData()
        let songBlob = new Blob([mp3Data.buffer], { type: 'audio/mpeg' })
        songFormData.append('file', songBlob, 'recordedAudio.mp3')

        const options = {
          method: 'POST',
          url: 'https://music-identify.p.rapidapi.com/identify',
          headers: {
            'X-RapidAPI-Key': process.env.REACT_APP_RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'music-identify.p.rapidapi.com',
            ...songFormData.getHeaders(),
          },
          data: songFormData,
        }

        try {
          const songResponse = await axios.request(options)
          console.log('Identified song:', songResponse.data)
          return songResponse.data
        } catch (error) {
          console.error(error)
        }
      }
    }, 5000)
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  identifySong,
}
