const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Album title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: [true, 'Artist is required']
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }],
  coverUrl: {
    type: String,
    default: '/images/default-cover.svg'
  },
  coverPublicId: {
    type: String,
    default: ''
  },
  releaseYear: {
    type: Number,
    default: new Date().getFullYear()
  },
  genre: {
    type: String,
    trim: true,
    default: 'Unknown'
  }
}, {
  timestamps: true
});

// Text index for search
albumSchema.index({ title: 'text' });

module.exports = mongoose.model('Album', albumSchema);
