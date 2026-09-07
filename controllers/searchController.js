const { asyncHandler } = require('../middleware/errorMiddleware');
const searchService = require('../services/searchService');

/**
 * GET /search — Search results page (SSR)
 */
const getSearchPage = asyncHandler(async (req, res) => {
  const { q } = req.query;
  let results = { songs: [], artists: [], albums: [] };

  if (q && q.trim().length > 0) {
    results = await searchService.searchAll(q);
  }

  res.render('pages/search', {
    title: q ? `"${q}" — Search — VibeTune` : 'Search — VibeTune',
    query: q || '',
    results
  });
});

/**
 * GET /search/api — Live search results (JSON for AJAX)
 */
const getSearchAPI = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return res.json({ songs: [], artists: [], albums: [] });
  }

  const results = await searchService.searchAll(q);
  res.json(results);
});

module.exports = {
  getSearchPage,
  getSearchAPI
};
