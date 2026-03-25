// src/routes/charityRoutes.js
const express = require('express')
const router = express.Router()
const { getAllCharities, getCharityById } = require('../controllers/charityController')

// Public routes
router.get('/',    getAllCharities)
router.get('/:id', getCharityById)

module.exports = router