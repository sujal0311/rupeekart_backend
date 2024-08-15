const mongoose = require('mongoose');
const { Schema } = mongoose;

const resetPasswordTokenSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // 10 mins expiration
  }
});

const ResetPasswordTokenModel = mongoose.model('ResetPasswordToken', resetPasswordTokenSchema);

module.exports = ResetPasswordTokenModel;
