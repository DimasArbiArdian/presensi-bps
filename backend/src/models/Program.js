import mongoose from 'mongoose';

const programSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    keterangan: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Program = mongoose.model('Program', programSchema);
