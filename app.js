const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');

const { setCurrentUser } = require('./middleware/authMiddleware');
const { setFlashMessages } = require('./middleware/flashMiddleware');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const songRoutes = require('./routes/songRoutes');
const artistRoutes = require('./routes/artistRoutes');
const albumRoutes = require('./routes/albumRoutes');
const searchRoutes = require('./routes/searchRoutes');
const libraryRoutes = require('./routes/libraryRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// ---------------------
// View Engine Setup
// ---------------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// ---------------------
// Static Files
// ---------------------
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------
// Body Parsers
// ---------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ---------------------
// Method Override
// ---------------------
app.use(methodOverride('_method'));

// ---------------------
// Session Configuration
// ---------------------
app.use(session({
  secret: process.env.SESSION_SECRET || 'vibetune-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// ---------------------
// Flash Messages
// ---------------------
app.use(flash());

// ---------------------
// Global Middleware
// ---------------------
app.use(setCurrentUser);
app.use(setFlashMessages);

// ---------------------
// Routes
// ---------------------
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/songs', songRoutes);
app.use('/artists', artistRoutes);
app.use('/albums', albumRoutes);
app.use('/search', searchRoutes);
app.use('/library', libraryRoutes);
app.use('/playlists', playlistRoutes);
app.use('/admin', adminRoutes);

// ---------------------
// Error Handling
// ---------------------
app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
