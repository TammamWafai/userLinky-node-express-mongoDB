const mongoose = require('mongoose')

const SocialMediaSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: [true, 'Please provide platform name'],
      maxlength: 50,
    },
    url: {
      type: String,
      required: [true, 'Please provide URL'],
      maxlength: 100,
    },
    createdBy: {
      type: String
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('SocialMedia', SocialMediaSchema)
