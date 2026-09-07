const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Artist name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  bio: {
    type: String,
    trim: true,
    default: '',
    maxlength: [2000, 'Bio cannot exceed 2000 characters']
  },
  image: {
    type: String,
    default: '/images/default-artist.svg'
  },
  imagePublicId: {
    type: String,
    default: ''
  },
  genres: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Text index for search
artistSchema.index({ name: 'text' });

module.exports = mongoose.model('Artist', artistSchema);
