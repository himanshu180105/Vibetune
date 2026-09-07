const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

router.get('/:id', songController.getSongDetail);
router.post('/:id/play', songController.incrementPlay);

module.exports = router;
