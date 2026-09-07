const Album = require('../models/Album');

/**
 * Get all albums with populated artist
 */
const getAllAlbums = async (limit = 0) => {
  const query = Album.find()
    .populate('artist', 'name image')
    .sort({ createdAt: -1 });
  if (limit > 0) query.limit(limit);
  return query;
};

/**
 * Get album by ID with populated artist and songs
 */
const getAlbumById = async (albumId) => {
  return Album.findById(albumId)
    .populate('artist', 'name image')
    .populate({
      path: 'songs',
      populate: { path: 'artist', select: 'name' }
    });
};

/**
 * Get albums by artist ID
 */
const getAlbumsByArtist = async (artistId) => {
  return Album.find({ artist: artistId })
    .populate('artist', 'name image')
    .sort({ releaseYear: -1 });
};

/**
 * Create a new album
 */
const createAlbum = async (albumData) => {
  return Album.create(albumData);
};

/**
 * Update an album
 */
const updateAlbum = async (albumId, updateData) => {
  return Album.findByIdAndUpdate(albumId, updateData, {
    new: true,
    runValidators: true
  });
};

/**
 * Add a song to an album
 */
const addSongToAlbum = async (albumId, songId) => {
  return Album.findByIdAndUpdate(
    albumId,
    { $addToSet: { songs: songId } },
    { new: true }
  );
};

/**
 * Remove a song from an album
 */
const removeSongFromAlbum = async (albumId, songId) => {
  return Album.findByIdAndUpdate(
    albumId,
    { $pull: { songs: songId } },
    { new: true }
  );
};

/**
 * Delete an album
 */
const deleteAlbum = async (albumId) => {
  return Album.findByIdAndDelete(albumId);
};

/**
 * Get album count
 */
const getAlbumCount = async () => {
  return Album.countDocuments();
};

module.exports = {
  getAllAlbums,
  getAlbumById,
  getAlbumsByArtist,
  createAlbum,
  updateAlbum,
  addSongToAlbum,
  removeSongFromAlbum,
  deleteAlbum,
  getAlbumCount
};
