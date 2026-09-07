# 🎵 VibeTune — Music Player App

A full-featured Spotify-clone music streaming web app built with **Node.js**, **Express.js**, **EJS**, and **MongoDB Atlas**.

![VibeTune](https://img.shields.io/badge/VibeTune-Music%20Player-1DB954?style=for-the-badge&logo=spotify&logoColor=white)

## ✨ Features

- 🔐 **Authentication** — Register, Login, Logout (session-based with MongoDB store)
- 🏠 **Home Page** — Featured songs, recently added, popular, genre sections
- 🔍 **Live Search** — Real-time AJAX search across songs, artists, albums
- 🎵 **Persistent Player** — Bottom bar with play/pause, next/prev, shuffle, repeat, seek, volume
- ❤️ **Liked Songs** — Toggle like on any song, dedicated liked songs page
- 📁 **Playlists** — Create, edit, delete playlists with add/remove songs
- 🎤 **Artist Pages** — Bio, image, discography, popular songs
- 💿 **Album Pages** — Cover art, numbered tracklist
- 📚 **Library** — User's playlists and liked songs
- 🏷️ **Browse by Genre** — Colorful genre cards with filtered listings
- 👑 **Admin Dashboard** — Full CRUD for songs, artists, albums with Cloudinary uploads
- 📱 **Responsive** — Mobile-friendly with collapsible sidebar
- ⌨️ **Keyboard Shortcuts** — Space (play/pause), arrows (seek/volume), M (mute)

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | EJS (SSR), HTML5, CSS3, Vanilla JS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **File Storage** | Cloudinary (audio & images) |
| **Auth** | express-session + connect-mongo |
| **Architecture** | MVC + Services Layer |

## 📁 Project Structure

```
Vibetune_music_app/
├── config/          # DB, Cloudinary, Multer configuration
├── controllers/     # Request handlers (9 controllers)
├── middleware/       # Auth, error, flash middleware
├── models/          # Mongoose schemas (User, Song, Artist, Album, Playlist)
├── public/          # Static assets (CSS, JS, images)
├── routes/          # Express route definitions (9 route files)
├── services/        # Business logic layer (7 services)
├── utils/           # Helper functions & validators
├── views/           # EJS templates (layouts, partials, pages, admin)
├── seeds/           # Database seed script
├── app.js           # Express app configuration
├── server.js        # Server entry point
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- **MongoDB Atlas** account (free tier works)
- **Cloudinary** account (free tier works)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/vibetune
SESSION_SECRET=your-super-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Seed the Database (Optional)

Populate with sample data (4 artists, 4 albums, 12 songs, test users):

```bash
npm run seed
```

### 4. Start the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Visit **http://localhost:3000** 🎉

### 🔑 Test Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@vibetune.com | admin123 |
| **User** | user@vibetune.com | user123 |

## 🎨 Design

- **Dark Theme** — Spotify-inspired (#121212 background, #1DB954 green accents)
- **Inter Font** — Clean, modern typography from Google Fonts
- **Responsive Layout** — Three-panel grid (sidebar + content + player bar)
- **Smooth Animations** — Hover effects, transitions, fade-in cards

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `→` | Seek forward 5s |
| `←` | Seek backward 5s |
| `Shift + →` | Next track |
| `Shift + ←` | Previous track |
| `↑` | Volume up |
| `↓` | Volume down |
| `M` | Mute / Unmute |

## 📄 License

MIT
# Vibetune
