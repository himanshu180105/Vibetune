const { asyncHandler } = require('../middleware/errorMiddleware');
const songService = require('../services/songService');
const playlistService = require('../services/playlistService');

/**
 * GET /songs/:id — Song detail page
 */
const getSongDetail = asyncHandler(async (req, res) => {
  const song = await songService.getSongById(req.params.id);

  if (!song) {
    req.flash('error', 'Song not found');
    return res.redirect('/');
  }

  // Get user playlists for "Add to Playlist" dropdown
  let userPlaylists = [];
  if (res.locals.currentUser) {
    userPlaylists = await playlistService.getUserPlaylists(res.locals.currentUser._id);
  }

  res.render('pages/songDetail', {
    title: `${song.title} — VibeTune`,
    song,
    userPlaylists
  });
});

/**
 * POST /songs/:id/play — Increment play count (AJAX)
 */
const incrementPlay = asyncHandler(async (req, res) => {
  await songService.incrementPlays(req.params.id);
  res.json({ success: true });
});

module.exports = {
  getSongDetail,
  incrementPlay
};
