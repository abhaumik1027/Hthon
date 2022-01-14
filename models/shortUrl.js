const mongoose = require('mongoose')

const shortUrlSchema = new mongoose.Schema({
  linkID: {
    type: String,
    required: true
  },
  full: {
    type: String,
    required: true
  },
  short: {
    type: String,
    required: true
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  },
  date: { type: String }
})

module.exports = mongoose.model('ShortUrl', shortUrlSchema)