const Artist = require('../models/Artist');

/**
 * Get all artists
 */
const getAllArtists = async (limit = 0) => {
  const query = Artist.find().sort({ name: 1 });
  if (limit > 0) query.limit(limit);
  return query;
};

/**
 * Get artist by ID
 */
const getArtistById = async (artistId) => {
  return Artist.findById(artistId);
};

/**
 * Create a new artist
 */
const createArtist = async (artistData) => {
  return Artist.create(artistData);
};

/**
 * Update an artist
 */
const updateArtist = async (artistId, updateData) => {
  return Artist.findByIdAndUpdate(artistId, updateData, {
    new: true,
    runValidators: true
  });
};

/**
 * Delete an artist
 */
const deleteArtist = async (artistId) => {
  return Artist.findByIdAndDelete(artistId);
};

/**
 * Get artist count
 */
const getArtistCount = async () => {
  return Artist.countDocuments();
};

module.exports = {
  getAllArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist,
  getArtistCount
};
