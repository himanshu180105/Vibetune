const Playlist = require('../models/Playlist');

/**
 * Get all playlists for a user
 */
const getUserPlaylists = async (userId) => {
  return Playlist.find({ user: userId })
    .populate('songs')
    .sort({ updatedAt: -1 });
};

/**
 * Get playlist by ID with populated songs
 */
const getPlaylistById = async (playlistId) => {
  return Playlist.findById(playlistId)
    .populate('user', 'name')
    .populate({
      path: 'songs',
      populate: { path: 'artist', select: 'name image' }
    });
};

/**
 * Create a new playlist
 */
const createPlaylist = async (playlistData) => {
  return Playlist.create(playlistData);
};

/**
 * Update a playlist
 */
const updatePlaylist = async (playlistId, userId, updateData) => {
  return Playlist.findOneAndUpdate(
    { _id: playlistId, user: userId },
    updateData,
    { new: true, runValidators: true }
  );
};

/**
 * Add a song to a playlist
 */
const addSongToPlaylist = async (playlistId, userId, songId) => {
  return Playlist.findOneAndUpdate(
    { _id: playlistId, user: userId },
    { $addToSet: { songs: songId } },
    { new: true }
  );
};

/**
 * Remove a song from a playlist
 */
const removeSongFromPlaylist = async (playlistId, userId, songId) => {
  return Playlist.findOneAndUpdate(
    { _id: playlistId, user: userId },
    { $pull: { songs: songId } },
    { new: true }
  );
};

/**
 * Delete a playlist
 */
const deletePlaylist = async (playlistId, userId) => {
  return Playlist.findOneAndDelete({ _id: playlistId, user: userId });
};

module.exports = {
  getUserPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist
};
