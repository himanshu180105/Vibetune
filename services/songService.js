const Song = require('../models/Song');

/**
 * Get all songs with populated artist and album
 */
const getAllSongs = async (limit = 0) => {
  const query = Song.find()
    .populate('artist', 'name image')
    .populate('album', 'title coverUrl')
    .sort({ createdAt: -1 });

  if (limit > 0) query.limit(limit);
  return query;
};

/**
 * Get a single song by ID
 */
const getSongById = async (songId) => {
  return Song.findById(songId)
    .populate('artist', 'name image')
    .populate('album', 'title coverUrl');
};

/**
 * Get songs by genre
 */
const getSongsByGenre = async (genre, limit = 20) => {
  return Song.find({ genre: new RegExp(genre, 'i') })
    .populate('artist', 'name image')
    .populate('album', 'title coverUrl')
    .sort({ createdAt: -1 })
    .limit(limit);
};

/**
 * Get songs by artist ID
 */
const getSongsByArtist = async (artistId) => {
  return Song.find({ artist: artistId })
    .populate('artist', 'name image')
    .populate('album', 'title coverUrl')
    .sort({ createdAt: -1 });
};

/**
 * Get songs by album ID
 */
const getSongsByAlbum = async (albumId) => {
  return Song.find({ album: albumId })
    .populate('artist', 'name image')
    .sort({ createdAt: -1 });
};

/**
 * Get recently added songs
 */
const getRecentSongs = async (limit = 10) => {
  return Song.find()
    .populate('artist', 'name image')
    .populate('album', 'title coverUrl')
    .sort({ createdAt: -1 })
    .limit(limit);
};

/**
 * Get popular songs (most played)
 */
const getPopularSongs = async (limit = 10) => {
  return Song.find()
    .populate('artist', 'name image')
    .populate('album', 'title coverUrl')
    .sort({ plays: -1 })
    .limit(limit);
};

/**
 * Create a new song
 */
const createSong = async (songData) => {
  return Song.create(songData);
};

/**
 * Update a song by ID
 */
const updateSong = async (songId, updateData) => {
  return Song.findByIdAndUpdate(songId, updateData, {
    new: true,
    runValidators: true
  });
};

/**
 * Delete a song by ID
 */
const deleteSong = async (songId) => {
  return Song.findByIdAndDelete(songId);
};

/**
 * Increment play count
 */
const incrementPlays = async (songId) => {
  return Song.findByIdAndUpdate(songId, { $inc: { plays: 1 } });
};

/**
 * Get all unique genres
 */
const getAllGenres = async () => {
  return Song.distinct('genre');
};

/**
 * Get total song count
 */
const getSongCount = async () => {
  return Song.countDocuments();
};

module.exports = {
  getAllSongs,
  getSongById,
  getSongsByGenre,
  getSongsByArtist,
  getSongsByAlbum,
  getRecentSongs,
  getPopularSongs,
  createSong,
  updateSong,
  deleteSong,
  incrementPlays,
  getAllGenres,
  getSongCount
};
