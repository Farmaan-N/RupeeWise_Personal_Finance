const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  // This is the new field we are adding
  name: { type: String, default: 'User' }, 
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  promptCount: { type: Number, default: 0 },
  lastPromptDate: { type: Date, default: Date.now },
});

// This function automatically encrypts the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;