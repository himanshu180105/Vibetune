const { asyncHandler } = require('../middleware/errorMiddleware');
const songService = require('../services/songService');
const artistService = require('../services/artistService');
const albumService = require('../services/albumService');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/uploadService');
const User = require('../models/User');

// ============================================
// Dashboard
// ============================================

/**
 * GET /admin — Admin dashboard overview
 */
const getDashboard = asyncHandler(async (req, res) => {
  const [songCount, artistCount, albumCount, userCount] = await Promise.all([
    songService.getSongCount(),
    artistService.getArtistCount(),
    albumService.getAlbumCount(),
    User.countDocuments()
  ]);

  res.render('admin/dashboard', {
    title: 'Admin Dashboard — VibeTune',
    songCount,
    artistCount,
    albumCount,
    userCount
  });
});

// ============================================
// Songs Management
// ============================================

/**
 * GET /admin/songs — List all songs
 */
const getManageSongs = asyncHandler(async (req, res) => {
  const songs = await songService.getAllSongs();
  res.render('admin/manageSongs', {
    title: 'Manage Songs — VibeTune',
    songs
  });
});

/**
 * GET /admin/songs/add — Add song form
 */
const getAddSong = asyncHandler(async (req, res) => {
  const [artists, albums] = await Promise.all([
    artistService.getAllArtists(),
    albumService.getAllAlbums()
  ]);

  res.render('admin/addSong', {
    title: 'Add Song — VibeTune',
    artists,
    albums
  });
});

/**
 * POST /admin/songs/add — Create new song with file uploads
 */
const postAddSong = asyncHandler(async (req, res) => {
  const { title, artist, album, genre, duration } = req.body;

  if (!title || !artist) {
    req.flash('error', 'Title and artist are required');
    return res.redirect('/admin/songs/add');
  }

  let audioUrl = '';
  let audioPublicId = '';
  let coverUrl = '/images/default-cover.svg';
  let coverPublicId = '';

  // Upload audio file
  if (req.files && req.files.audio && req.files.audio[0]) {
    const audioResult = await uploadToCloudinary(
      req.files.audio[0].buffer,
      'songs',
      'video' // Cloudinary treats audio as 'video' resource type
    );
    audioUrl = audioResult.url;
    audioPublicId = audioResult.publicId;
  } else {
    req.flash('error', 'Audio file is required');
    return res.redirect('/admin/songs/add');
  }

  // Upload cover image (optional)
  if (req.files && req.files.cover && req.files.cover[0]) {
    const coverResult = await uploadToCloudinary(
      req.files.cover[0].buffer,
      'covers',
      'image'
    );
    coverUrl = coverResult.url;
    coverPublicId = coverResult.publicId;
  }

  const song = await songService.createSong({
    title,
    artist,
    album: album || null,
    audioUrl,
    audioPublicId,
    coverUrl,
    coverPublicId,
    genre: genre || 'Unknown',
    duration: parseInt(duration) || 0
  });

  // If album is specified, add song to album
  if (album) {
    const albumService = require('../services/albumService');
    await albumService.addSongToAlbum(album, song._id);
  }

  req.flash('success', `Song "${title}" added successfully!`);
  res.redirect('/admin/songs');
});

/**
 * GET /admin/songs/edit/:id — Edit song form
 */
const getEditSong = asyncHandler(async (req, res) => {
  const [song, artists, albums] = await Promise.all([
    songService.getSongById(req.params.id),
    artistService.getAllArtists(),
    albumService.getAllAlbums()
  ]);

  if (!song) {
    req.flash('error', 'Song not found');
    return res.redirect('/admin/songs');
  }

  res.render('admin/editSong', {
    title: `Edit ${song.title} — VibeTune`,
    song,
    artists,
    albums
  });
});

/**
 * PUT /admin/songs/edit/:id — Update song
 */
const putEditSong = asyncHandler(async (req, res) => {
  const { title, artist, album, genre, duration } = req.body;
  const song = await songService.getSongById(req.params.id);

  if (!song) {
    req.flash('error', 'Song not found');
    return res.redirect('/admin/songs');
  }

  const updateData = {
    title,
    artist,
    album: album || null,
    genre: genre || 'Unknown',
    duration: parseInt(duration) || song.duration
  };

  // Upload new audio if provided
  if (req.files && req.files.audio && req.files.audio[0]) {
    // Delete old audio from Cloudinary
    await deleteFromCloudinary(song.audioPublicId, 'video');

    const audioResult = await uploadToCloudinary(
      req.files.audio[0].buffer,
      'songs',
      'video'
    );
    updateData.audioUrl = audioResult.url;
    updateData.audioPublicId = audioResult.publicId;
  }

  // Upload new cover if provided
  if (req.files && req.files.cover && req.files.cover[0]) {
    if (song.coverPublicId) {
      await deleteFromCloudinary(song.coverPublicId, 'image');
    }

    const coverResult = await uploadToCloudinary(
      req.files.cover[0].buffer,
      'covers',
      'image'
    );
    updateData.coverUrl = coverResult.url;
    updateData.coverPublicId = coverResult.publicId;
  }

  await songService.updateSong(req.params.id, updateData);

  req.flash('success', `Song "${title}" updated!`);
  res.redirect('/admin/songs');
});

/**
 * DELETE /admin/songs/:id — Delete song
 */
const deleteSong = asyncHandler(async (req, res) => {
  const song = await songService.getSongById(req.params.id);

  if (song) {
    // Delete files from Cloudinary
    await deleteFromCloudinary(song.audioPublicId, 'video');
    if (song.coverPublicId) {
      await deleteFromCloudinary(song.coverPublicId, 'image');
    }
    await songService.deleteSong(req.params.id);
  }

  req.flash('success', 'Song deleted');
  res.redirect('/admin/songs');
});

// ============================================
// Artists Management
// ============================================

/**
 * GET /admin/artists — List all artists
 */
const getManageArtists = asyncHandler(async (req, res) => {
  const artists = await artistService.getAllArtists();
  res.render('admin/manageArtists', {
    title: 'Manage Artists — VibeTune',
    artists
  });
});

/**
 * GET /admin/artists/add — Add artist form
 */
const getAddArtist = (req, res) => {
  res.render('admin/addArtist', {
    title: 'Add Artist — VibeTune'
  });
};

/**
 * POST /admin/artists/add — Create artist
 */
const postAddArtist = asyncHandler(async (req, res) => {
  const { name, bio, genres } = req.body;

  if (!name) {
    req.flash('error', 'Artist name is required');
    return res.redirect('/admin/artists/add');
  }

  let image = '/images/default-artist.svg';
  let imagePublicId = '';

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, 'artists', 'image');
    image = result.url;
    imagePublicId = result.publicId;
  }

  await artistService.createArtist({
    name,
    bio: bio || '',
    image,
    imagePublicId,
    genres: genres ? genres.split(',').map(g => g.trim()) : []
  });

  req.flash('success', `Artist "${name}" added!`);
  res.redirect('/admin/artists');
});

/**
 * GET /admin/artists/edit/:id — Edit artist form
 */
const getEditArtist = asyncHandler(async (req, res) => {
  const artist = await artistService.getArtistById(req.params.id);

  if (!artist) {
    req.flash('error', 'Artist not found');
    return res.redirect('/admin/artists');
  }

  res.render('admin/editArtist', {
    title: `Edit ${artist.name} — VibeTune`,
    artist
  });
});

/**
 * PUT /admin/artists/edit/:id — Update artist
 */
const putEditArtist = asyncHandler(async (req, res) => {
  const { name, bio, genres } = req.body;
  const artist = await artistService.getArtistById(req.params.id);

  if (!artist) {
    req.flash('error', 'Artist not found');
    return res.redirect('/admin/artists');
  }

  const updateData = {
    name,
    bio: bio || '',
    genres: genres ? genres.split(',').map(g => g.trim()) : []
  };

  if (req.file) {
    if (artist.imagePublicId) {
      await deleteFromCloudinary(artist.imagePublicId, 'image');
    }
    const result = await uploadToCloudinary(req.file.buffer, 'artists', 'image');
    updateData.image = result.url;
    updateData.imagePublicId = result.publicId;
  }

  await artistService.updateArtist(req.params.id, updateData);
  req.flash('success', `Artist "${name}" updated!`);
  res.redirect('/admin/artists');
});

/**
 * DELETE /admin/artists/:id — Delete artist
 */
const deleteArtist = asyncHandler(async (req, res) => {
  const artist = await artistService.getArtistById(req.params.id);

  if (artist && artist.imagePublicId) {
    await deleteFromCloudinary(artist.imagePublicId, 'image');
  }

  await artistService.deleteArtist(req.params.id);
  req.flash('success', 'Artist deleted');
  res.redirect('/admin/artists');
});

// ============================================
// Albums Management
// ============================================

/**
 * GET /admin/albums — List all albums
 */
const getManageAlbums = asyncHandler(async (req, res) => {
  const albums = await albumService.getAllAlbums();
  res.render('admin/manageAlbums', {
    title: 'Manage Albums — VibeTune',
    albums
  });
});

/**
 * GET /admin/albums/add — Add album form
 */
const getAddAlbum = asyncHandler(async (req, res) => {
  const artists = await artistService.getAllArtists();
  res.render('admin/addAlbum', {
    title: 'Add Album — VibeTune',
    artists
  });
});

/**
 * POST /admin/albums/add — Create album
 */
const postAddAlbum = asyncHandler(async (req, res) => {
  const { title, artist, releaseYear, genre } = req.body;

  if (!title || !artist) {
    req.flash('error', 'Title and artist are required');
    return res.redirect('/admin/albums/add');
  }

  let coverUrl = '/images/default-cover.svg';
  let coverPublicId = '';

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, 'albums', 'image');
    coverUrl = result.url;
    coverPublicId = result.publicId;
  }

  await albumService.createAlbum({
    title,
    artist,
    coverUrl,
    coverPublicId,
    releaseYear: parseInt(releaseYear) || new Date().getFullYear(),
    genre: genre || 'Unknown'
  });

  req.flash('success', `Album "${title}" added!`);
  res.redirect('/admin/albums');
});

/**
 * GET /admin/albums/edit/:id — Edit album form
 */
const getEditAlbum = asyncHandler(async (req, res) => {
  const [album, artists] = await Promise.all([
    albumService.getAlbumById(req.params.id),
    artistService.getAllArtists()
  ]);

  if (!album) {
    req.flash('error', 'Album not found');
    return res.redirect('/admin/albums');
  }

  res.render('admin/editAlbum', {
    title: `Edit ${album.title} — VibeTune`,
    album,
    artists
  });
});

/**
 * PUT /admin/albums/edit/:id — Update album
 */
const putEditAlbum = asyncHandler(async (req, res) => {
  const { title, artist, releaseYear, genre } = req.body;
  const album = await albumService.getAlbumById(req.params.id);

  if (!album) {
    req.flash('error', 'Album not found');
    return res.redirect('/admin/albums');
  }

  const updateData = {
    title,
    artist,
    releaseYear: parseInt(releaseYear) || album.releaseYear,
    genre: genre || 'Unknown'
  };

  if (req.file) {
    if (album.coverPublicId) {
      await deleteFromCloudinary(album.coverPublicId, 'image');
    }
    const result = await uploadToCloudinary(req.file.buffer, 'albums', 'image');
    updateData.coverUrl = result.url;
    updateData.coverPublicId = result.publicId;
  }

  await albumService.updateAlbum(req.params.id, updateData);
  req.flash('success', `Album "${title}" updated!`);
  res.redirect('/admin/albums');
});

/**
 * DELETE /admin/albums/:id — Delete album
 */
const deleteAlbum = asyncHandler(async (req, res) => {
  const album = await albumService.getAlbumById(req.params.id);

  if (album && album.coverPublicId) {
    await deleteFromCloudinary(album.coverPublicId, 'image');
  }

  await albumService.deleteAlbum(req.params.id);
  req.flash('success', 'Album deleted');
  res.redirect('/admin/albums');
});

module.exports = {
  getDashboard,
  getManageSongs,
  getAddSong,
  postAddSong,
  getEditSong,
  putEditSong,
  deleteSong,
  getManageArtists,
  getAddArtist,
  postAddArtist,
  getEditArtist,
  putEditArtist,
  deleteArtist,
  getManageAlbums,
  getAddAlbum,
  postAddAlbum,
  getEditAlbum,
  putEditAlbum,
  deleteAlbum
};
