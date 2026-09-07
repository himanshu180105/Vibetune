const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../config/multer');

// All admin routes require authentication + admin role
router.use(isAuthenticated);
router.use(isAdmin);

// Dashboard
router.get('/', adminController.getDashboard);

// Songs
router.get('/songs', adminController.getManageSongs);
router.get('/songs/add', adminController.getAddSong);
router.post('/songs/add', upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]), adminController.postAddSong);
router.get('/songs/edit/:id', adminController.getEditSong);
router.put('/songs/edit/:id', upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]), adminController.putEditSong);
router.delete('/songs/:id', adminController.deleteSong);

// Artists
router.get('/artists', adminController.getManageArtists);
router.get('/artists/add', adminController.getAddArtist);
router.post('/artists/add', upload.single('image'), adminController.postAddArtist);
router.get('/artists/edit/:id', adminController.getEditArtist);
router.put('/artists/edit/:id', upload.single('image'), adminController.putEditArtist);
router.delete('/artists/:id', adminController.deleteArtist);

// Albums
router.get('/albums', adminController.getManageAlbums);
router.get('/albums/add', adminController.getAddAlbum);
router.post('/albums/add', upload.single('cover'), adminController.postAddAlbum);
router.get('/albums/edit/:id', adminController.getEditAlbum);
router.put('/albums/edit/:id', upload.single('cover'), adminController.putEditAlbum);
router.delete('/albums/:id', adminController.deleteAlbum);

module.exports = router;
