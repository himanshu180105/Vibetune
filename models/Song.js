const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Song title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: [true, 'Artist is required']
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    default: null
  },
  audioUrl: {
    type: String,
    required: [true, 'Audio URL is required']
  },
  audioPublicId: {
    type: String,
    default: ''
  },
  coverUrl: {
    type: String,
    default: '/images/default-cover.svg'
  },
  coverPublicId: {
    type: String,
    default: ''
  },
  duration: {
    type: Number, // Duration in seconds
    default: 0
  },
  genre: {
    type: String,
    trim: true,
    default: 'Unknown'
  },
  plays: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// ---------------------
// Text index for search
// ---------------------
songSchema.index({ title: 'text' });

// ---------------------
// Virtual: formatted duration (mm:ss)
// ---------------------
songSchema.virtual('formattedDuration').get(function () {
  const mins = Math.floor(this.duration / 60);
  const secs = Math.floor(this.duration % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
});

// Ensure virtuals are included in JSON
songSchema.set('toJSON', { virtuals: true });
songSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Song', songSchema);
