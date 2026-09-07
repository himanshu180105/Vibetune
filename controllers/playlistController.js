const { asyncHandler } = require('../middleware/errorMiddleware');
const playlistService = require('../services/playlistService');

/**
 * GET /playlists/:id — Playlist detail page
 */
const getPlaylistDetail = asyncHandler(async (req, res) => {
  const playlist = await playlistService.getPlaylistById(req.params.id);

  if (!playlist) {
    req.flash('error', 'Playlist not found');
    return res.redirect('/library');
  }

  // Check if user owns this playlist or if it's public
  const isOwner = res.locals.currentUser &&
    playlist.user._id.toString() === res.locals.currentUser._id.toString();

  if (!playlist.isPublic && !isOwner) {
    req.flash('error', 'This playlist is private');
    return res.redirect('/library');
  }

  res.render('pages/playlist', {
    title: `${playlist.name} — VibeTune`,
    playlist,
    isOwner
  });
});

/**
 * POST /playlists/create — Create a new playlist
 */
const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description, isPublic } = req.body;

  if (!name || !name.trim()) {
    req.flash('error', 'Playlist name is required');
    return res.redirect('/library');
  }

  await playlistService.createPlaylist({
    name: name.trim(),
    description: description ? description.trim() : '',
    user: req.session.userId,
    isPublic: isPublic === 'on'
  });

  req.flash('success', 'Playlist created!');
  res.redirect('/library');
});

/**
 * PUT /playlists/:id — Update playlist
 */
const updatePlaylist = asyncHandler(async (req, res) => {
  const { name, description, isPublic } = req.body;

  await playlistService.updatePlaylist(req.params.id, req.session.userId, {
    name: name ? name.trim() : undefined,
    description: description ? description.trim() : '',
    isPublic: isPublic === 'on'
  });

  req.flash('success', 'Playlist updated!');
  res.redirect(`/playlists/${req.params.id}`);
});

/**
 * DELETE /playlists/:id — Delete playlist
 */
const deletePlaylist = asyncHandler(async (req, res) => {
  await playlistService.deletePlaylist(req.params.id, req.session.userId);
  req.flash('success', 'Playlist deleted');
  res.redirect('/library');
});

/**
 * POST /playlists/:id/songs — Add a song to playlist (AJAX)
 */
const addSong = asyncHandler(async (req, res) => {
  const { songId } = req.body;
  await playlistService.addSongToPlaylist(req.params.id, req.session.userId, songId);
  res.json({ success: true, message: 'Song added to playlist' });
});

/**
 * DELETE /playlists/:id/songs/:songId — Remove a song from playlist
 */
const removeSong = asyncHandler(async (req, res) => {
  await playlistService.removeSongFromPlaylist(
    req.params.id,
    req.session.userId,
    req.params.songId
  );

  req.flash('success', 'Song removed from playlist');
  res.redirect(`/playlists/${req.params.id}`);
});

module.exports = {
  getPlaylistDetail,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSong,
  removeSong
};
