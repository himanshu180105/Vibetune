const { asyncHandler } = require('../middleware/errorMiddleware');
const User = require('../models/User');
const Song = require('../models/Song');
const playlistService = require('../services/playlistService');

/**
 * GET /library — User library page (playlists + liked songs)
 */
const getLibrary = asyncHandler(async (req, res) => {
  const playlists = await playlistService.getUserPlaylists(req.session.userId);

  const user = await User.findById(req.session.userId)
    .populate({
      path: 'likedSongs',
      populate: { path: 'artist', select: 'name image' }
    });

  res.render('pages/library', {
    title: 'Your Library — VibeTune',
    playlists,
    likedSongs: user.likedSongs || []
  });
});

/**
 * GET /library/liked — Liked songs page
 */
const getLikedSongs = asyncHandler(async (req, res) => {
  const user = await User.findById(req.session.userId)
    .populate({
      path: 'likedSongs',
      populate: { path: 'artist', select: 'name image' }
    });

  res.render('pages/likedSongs', {
    title: 'Liked Songs — VibeTune',
    likedSongs: user.likedSongs || []
  });
});

/**
 * POST /library/like/:songId — Toggle like on a song (AJAX)
 */
const toggleLike = asyncHandler(async (req, res) => {
  const { songId } = req.params;
  const userId = req.session.userId;

  const user = await User.findById(userId);
  const isLiked = user.likedSongs.includes(songId);

  if (isLiked) {
    user.likedSongs.pull(songId);
  } else {
    user.likedSongs.addToSet(songId);
  }

  await user.save();

  res.json({
    success: true,
    liked: !isLiked,
    message: isLiked ? 'Removed from Liked Songs' : 'Added to Liked Songs'
  });
});

module.exports = {
  getLibrary,
  getLikedSongs,
  toggleLike
};
