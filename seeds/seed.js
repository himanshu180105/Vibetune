/**
 * VibeTune — Database Seed Script
 *
 * Populates the database with sample artists, albums, songs, and users.
 * Usage: npm run seed
 *
 * NOTE: This script uses free sample audio URLs for testing.
 * Replace with your own Cloudinary-uploaded audio URLs for production.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Song = require('../models/Song');
const Playlist = require('../models/Playlist');

// Free sample audio URLs (short clips for testing)
const SAMPLE_AUDIO = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3'
];

const seed = async () => {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Artist.deleteMany({}),
      Album.deleteMany({}),
      Song.deleteMany({}),
      Playlist.deleteMany({})
    ]);

    // ---- Create Users ----
    console.log('👤 Creating users...');
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@vibetune.com',
      password: 'admin123',
      role: 'admin'
    });

    const regularUser = await User.create({
      name: 'Music Lover',
      email: 'user@vibetune.com',
      password: 'user123',
      role: 'user'
    });

    // ---- Create Artists ----
    console.log('🎤 Creating artists...');
    const artists = await Artist.insertMany([
      {
        name: 'Lunar Echo',
        bio: 'Lunar Echo is an electronic music producer known for ethereal soundscapes and ambient textures that transport listeners to another dimension.',
        image: '/images/default-artist.svg',
        genres: ['Electronic', 'Ambient']
      },
      {
        name: 'Crimson Tide',
        bio: 'Crimson Tide is a rock band that blends classic rock energy with modern production, creating powerful anthems that resonate with audiences worldwide.',
        image: '/images/default-artist.svg',
        genres: ['Rock', 'Alternative']
      },
      {
        name: 'Velvet Storm',
        bio: 'Velvet Storm brings smooth R&B vocals together with hip-hop beats, crafting a unique sound that has captivated millions of fans globally.',
        image: '/images/default-artist.svg',
        genres: ['R&B', 'Hip-Hop']
      },
      {
        name: 'Nova Dreams',
        bio: 'Nova Dreams creates dreamy pop melodies infused with synth-wave elements. Their music is a perfect blend of nostalgia and modernity.',
        image: '/images/default-artist.svg',
        genres: ['Pop', 'Synth-wave']
      }
    ]);

    // ---- Create Albums ----
    console.log('💿 Creating albums...');
    const albums = await Album.insertMany([
      {
        title: 'Midnight Frequencies',
        artist: artists[0]._id,
        coverUrl: '/images/default-cover.svg',
        releaseYear: 2024,
        genre: 'Electronic'
      },
      {
        title: 'Breaking Ground',
        artist: artists[1]._id,
        coverUrl: '/images/default-cover.svg',
        releaseYear: 2024,
        genre: 'Rock'
      },
      {
        title: 'Silk & Gold',
        artist: artists[2]._id,
        coverUrl: '/images/default-cover.svg',
        releaseYear: 2025,
        genre: 'R&B'
      },
      {
        title: 'Neon Horizons',
        artist: artists[3]._id,
        coverUrl: '/images/default-cover.svg',
        releaseYear: 2025,
        genre: 'Pop'
      }
    ]);

    // ---- Create Songs ----
    console.log('🎵 Creating songs...');
    const songsData = [
      // Lunar Echo — Midnight Frequencies
      { title: 'Digital Sunset', artist: artists[0]._id, album: albums[0]._id, genre: 'Electronic', duration: 372, plays: 15420 },
      { title: 'Neon Rain', artist: artists[0]._id, album: albums[0]._id, genre: 'Electronic', duration: 298, plays: 12800 },
      { title: 'Cosmic Drift', artist: artists[0]._id, album: albums[0]._id, genre: 'Ambient', duration: 445, plays: 9100 },

      // Crimson Tide — Breaking Ground
      { title: 'Thunder Road', artist: artists[1]._id, album: albums[1]._id, genre: 'Rock', duration: 264, plays: 25300 },
      { title: 'Rebel Hearts', artist: artists[1]._id, album: albums[1]._id, genre: 'Rock', duration: 312, plays: 19700 },
      { title: 'Edge of Tomorrow', artist: artists[1]._id, album: albums[1]._id, genre: 'Alternative', duration: 287, plays: 16400 },

      // Velvet Storm — Silk & Gold
      { title: 'Midnight Serenade', artist: artists[2]._id, album: albums[2]._id, genre: 'R&B', duration: 241, plays: 31200 },
      { title: 'Golden Hour', artist: artists[2]._id, album: albums[2]._id, genre: 'R&B', duration: 218, plays: 28900 },
      { title: 'City Lights', artist: artists[2]._id, album: albums[2]._id, genre: 'Hip-Hop', duration: 195, plays: 22100 },

      // Nova Dreams — Neon Horizons
      { title: 'Starlight Drive', artist: artists[3]._id, album: albums[3]._id, genre: 'Pop', duration: 232, plays: 42500 },
      { title: 'Electric Dreams', artist: artists[3]._id, album: albums[3]._id, genre: 'Synth-wave', duration: 268, plays: 38700 },
      { title: 'Ocean Waves', artist: artists[3]._id, album: albums[3]._id, genre: 'Pop', duration: 305, plays: 35100 }
    ];

    // Assign sample audio URLs
    const songs = await Song.insertMany(
      songsData.map((song, index) => ({
        ...song,
        audioUrl: SAMPLE_AUDIO[index % SAMPLE_AUDIO.length],
        coverUrl: '/images/default-cover.svg'
      }))
    );

    // ---- Update albums with song references ----
    console.log('🔗 Linking songs to albums...');
    for (const album of albums) {
      const albumSongs = songs.filter(s => s.album && s.album.toString() === album._id.toString());
      album.songs = albumSongs.map(s => s._id);
      await album.save();
    }

    // ---- Create a sample playlist ----
    console.log('📋 Creating sample playlist...');
    await Playlist.create({
      name: 'My Favorites',
      description: 'A mix of my all-time favorite tracks',
      user: regularUser._id,
      songs: [songs[0]._id, songs[3]._id, songs[6]._id, songs[9]._id],
      isPublic: true
    });

    // ---- Add some liked songs for the regular user ----
    regularUser.likedSongs = [songs[0]._id, songs[6]._id, songs[9]._id, songs[10]._id];
    await regularUser.save();

    // ---- Summary ----
    console.log('\n✅ Seed completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   Users:     ${2} (1 admin + 1 regular)`);
    console.log(`   Artists:   ${artists.length}`);
    console.log(`   Albums:    ${albums.length}`);
    console.log(`   Songs:     ${songs.length}`);
    console.log(`   Playlists: 1`);
    console.log('\n🔑 Login Credentials:');
    console.log('   Admin:   admin@vibetune.com / admin123');
    console.log('   User:    user@vibetune.com  / user123');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seed();
