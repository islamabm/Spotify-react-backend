const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query() {
  try {
    const collection = await dbService.getCollection('react_playlist')

    var stations = await collection.find().toArray()

    return stations
  } catch (err) {
    logger.error('cannot find stations', err)
    throw err
  }
}

async function getById(stationId) {
  try {
    const collection = await dbService.getCollection('react_playlist')

    const station = collection.findOne({ _id: new ObjectId(stationId) })

    return station
  } catch (err) {
    logger.error(`while finding station ${stationId}`, err)
    throw err
  }
}

async function remove(stationId) {
  try {
    const collection = await dbService.getCollection('react_playlist')
    await collection.deleteOne({ _id: new ObjectId(stationId) })
    return stationId
  } catch (err) {
    logger.error(`cannot remove station ${stationId}`, err)
    throw err
  }
}

async function add(station) {
  try {
    const collection = await dbService.getCollection('react_playlist')
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
      desc: station.desc,
      imgUrl: station.imgUrl,
    }
    const collection = await dbService.getCollection('react_playlist')
    await collection.updateOne(
      { _id: new ObjectId(station._id) },
      { $set: stationToSave }
    )
    return station
  } catch (err) {
    logger.error(`cannot update station ${station._id}`, err)
    throw err
  }
}

async function updateSongs(stationId, songs) {
  try {
    const collection = await dbService.getCollection('react_playlist')
    const station = await collection.findOneAndUpdate(
      { _id: new ObjectId(stationId) },
      { $set: { songs: songs } },
      { returnOriginal: false }
    )
    return station.value
  } catch (err) {
    logger.error(`cannot update station ${stationId}`, err)
    throw err
  }
}

async function addStationSong(stationId, song) {
  try {
    const collection = await dbService.getCollection('react_playlist')
    const station = await collection.findOne({ _id: new ObjectId(stationId) })

    const songAlreadyInStation = station.songs.some(
      (existingSong) => existingSong._id === song._id
    )
    if (songAlreadyInStation) {
      song._id = song._id + '-' + Math.random().toString(36).substring(2, 15)
    }

    await collection.updateOne(
      { _id: new ObjectId(stationId) },
      { $push: { songs: song } }
    )
    return song
  } catch (err) {
    logger.error(`cannot add station song ${stationId}`, err)
    throw err
  }
}

async function removeStationSong(stationId, songId) {
  try {
    const collection = await dbService.getCollection('react_playlist')
    const station = await collection.updateOne(
      { _id: new ObjectId(stationId) },
      { $pull: { songs: { _id: songId } } }
    )
    return songId
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
  updateSongs,
}
