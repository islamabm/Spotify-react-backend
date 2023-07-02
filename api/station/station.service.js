const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query() {
  try {
    const collection = await dbService.getCollection('station')

    var stations = await collection.find().toArray()

    return stations
  } catch (err) {
    logger.error('cannot find stations', err)
    throw err
  }
}

async function getById(stationId) {
  try {
    const collection = await dbService.getCollection('station')

    const station = collection.findOne({ _id: new ObjectId(stationId) })

    return station
  } catch (err) {
    logger.error(`while finding station ${stationId}`, err)
    throw err
  }
}

async function remove(stationId) {
  try {
    const collection = await dbService.getCollection('station')
    await collection.deleteOne({ _id: new ObjectId(stationId) })
    return stationId
  } catch (err) {
    logger.error(`cannot remove station ${stationId}`, err)
    throw err
  }
}

async function add(station) {
  try {
    const collection = await dbService.getCollection('station')
    await collection.insertOne(station)
    return station
  } catch (err) {
    logger.error('cannot insert station', err)
    throw err
  }
}

async function update(station) {
  try {
    const stationToSave = {
      name: station.name,
      imgUrl: station.imgUrl,
    }
    const collection = await dbService.getCollection('station')
    await collection.updateOne(
      { _id: new ObjectId(station._id) },
      { $set: stationToSave }
    )
    return station
  } catch (err) {
    logger.error(`cannot update station ${stationId}`, err)
    throw err
  }
}

async function addStationSong(stationId, song) {
  try {
    const collection = await dbService.getCollection('station')
    await collection.updateOne(
      { _id: new ObjectId(stationId) },
      { $push: { songs: song } }
    )
    return song
  } catch (err) {
    logger.error(`cannot add station msg ${stationId}`, err)
    throw err
  }
}

//Step 6
async function removeStationSong(stationId, songArtist, songTitle) {
  try {
    const collection = await dbService.getCollection('station')
    await collection.updateOne(
      { _id: new ObjectId(stationId) },
      { $pull: { songs: { artist: songArtist, title: songTitle } } }
    )
    return { artist: songArtist, title: songTitle }
  } catch (err) {
    logger.error(`cannot add station msg ${stationId}`, err)
    throw err
  }
}
module.exports = {
  remove,
  query,
  getById,
  add,
  update,
  addStationSong,
  removeStationSong,
}
