const express = require('express')
const {
  requireAuth,
  requireAdmin,
} = require('../../middlewares/requireAuth.middleware')
const {
  getUser,
  getUsers,
  deleteUser,
  updateUser,
  getUserDetails,
  updateUserImg,
  updateLatestStations
} = require('./user.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id', updateUser)
router.put('/latest/:id', updateLatestStations)
router.put('/img/:id', updateUserImg)
router.get('/details/:id', getUserDetails)

// router.put('/:id',  requireAuth, updateUser)
router.delete('/:id', requireAuth, requireAdmin, deleteUser)

module.exports = router
