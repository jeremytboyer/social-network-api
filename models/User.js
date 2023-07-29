const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        // Regular expression to match a valid email address
        return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value);
      },
      message: 'Invalid email address'
    }
  },
  thoughts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thought'
  }],
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

// Virtual to get the friendCount
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

const User = mongoose.model('User', userSchema);

module.exports = User;
