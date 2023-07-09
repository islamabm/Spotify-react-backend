const axios = require('axios')
const FormData = require('form-data')
require('dotenv').config()

async function identifySong(audioData) {
  try {
    // Convert audioData to base64
    const audioDataBase64 = Buffer.from(audioData.buffer).toString('base64')

    // Send POST request to Convertio for conversion
    let response = await axios({
      method: 'post',
      url: 'https://api.convertio.co/convert',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        apikey: process.env.CONVERTIO_API_KEY,
        input: 'base64',
        file: audioDataBase64,
        format: 'mp3',
      },
    })

    // Save the process ID for polling conversion status
    let processId = response.data.data.id

    // Poll the API every 5 seconds to check conversion status
    let timer = setInterval(async () => {
      let jobResponse = await axios.get(
        `https://api.convertio.co/convert/${processId}/status`,
        {
          params: {
            apikey: process.env.CONVERTIO_API_KEY,
          },
        }
      )

      // If status is "finished", download the MP3 file
      if (jobResponse.data.status === 'finished') {
        let downloadUrl = jobResponse.data.output.url
        let fileResponse = await axios.get(downloadUrl, {
          responseType: 'arraybuffer',
        })

        let mp3Data = new Uint8Array(fileResponse.data)
        console.log('mp3Dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', mp3Data)
        clearInterval(timer)

        // Once mp3 is downloaded, use Shazam API to identify song
        let songFormData = new FormData()
        let songBlob = new Blob([mp3Data.buffer], { type: 'audio/mpeg' })
        songFormData.append('file', songBlob, 'recordedAudio.mp3')
        console.log(
          'songFormDataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          songFormData
        )

        const options = {
          method: 'POST',
          url: 'https://music-identify.p.rapidapi.com/identify',
          headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'music-identify.p.rapidapi.com',
            ...songFormData.getHeaders(),
          },
          data: songFormData,
        }

        try {
          const songResponse = await axios.request(options)
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
