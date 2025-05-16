import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  googleId: {
    type: String,
    required: true,
    unique: true
  }
});

export default mongoose.model('User', userSchema);

