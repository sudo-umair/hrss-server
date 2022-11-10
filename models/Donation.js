import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
});

export default mongoose.model('donations', donationSchema);
