const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// All library routes require authentication
router.use(isAuthenticated);

router.get('/', libraryController.getLibrary);
router.get('/liked', libraryController.getLikedSongs);
router.post('/like/:songId', libraryController.toggleLike);

module.exports = router;
