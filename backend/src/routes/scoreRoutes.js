// backend/src/routes/scoreRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUserScores, addUserScores } = require('../controllers/scoreController');

router.get('/', protect, getUserScores);
router.post('/', protect, addUserScores);

module.exports = router;
