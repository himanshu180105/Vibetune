const { asyncHandler } = require('../middleware/errorMiddleware');
const albumService = require('../services/albumService');

/**
 * GET /albums/:id — Album detail page
 */
const getAlbumDetail = asyncHandler(async (req, res) => {
  const album = await albumService.getAlbumById(req.params.id);

  if (!album) {
    req.flash('error', 'Album not found');
    return res.redirect('/');
  }

  res.render('pages/album', {
    title: `${album.title} — VibeTune`,
    album
  });
});

module.exports = {
  getAlbumDetail
};
