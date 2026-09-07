const Song = require('../models/Song');
const Artist = require('../models/Artist');
const Album = require('../models/Album');

/**
 * Search across songs, artists, and albums using regex
 * @param {string} query - Search query string
 * @returns {Promise<{songs: Array, artists: Array, albums: Array}>}
 */
const searchAll = async (query) => {
  if (!query || query.trim().length === 0) {
    return { songs: [], artists: [], albums: [] };
  }

  const searchRegex = new RegExp(query.trim(), 'i');

  const [songs, artists, albums] = await Promise.all([
    Song.find({ title: searchRegex })
      .populate('artist', 'name image')
      .populate('album', 'title coverUrl')
      .limit(20),

    Artist.find({ name: searchRegex })
      .limit(10),

    Album.find({ title: searchRegex })
      .populate('artist', 'name image')
      .limit(10)
  ]);

  return { songs, artists, albums };
};

module.exports = { searchAll };
