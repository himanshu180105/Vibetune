const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Public route — view playlist (checks public/private inside controller)
router.get('/:id', playlistController.getPlaylistDetail);

// Protected routes
router.post('/create', isAuthenticated, playlistController.createPlaylist);
router.put('/:id', isAuthenticated, playlistController.updatePlaylist);
router.delete('/:id', isAuthenticated, playlistController.deletePlaylist);
router.post('/:id/songs', isAuthenticated, playlistController.addSong);
router.delete('/:id/songs/:songId', isAuthenticated, playlistController.removeSong);

module.exports = router;
