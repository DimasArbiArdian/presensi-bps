import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema(
  {
    intern: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Intern',
      required: false,
    },
    no_id: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    tgl_izin: {
      type: String, // Format: YYYY-MM-DD
      required: true,
      index: true,
    },
    status_izin: {
      type: String,
      enum: ['i', 's'], // 'i': Izin, 's': Sakit
      required: true,
    },
    keterangan: {
      type: String,
      required: true,
      trim: true,
    },
    status_approve: {
      type: Number,
      enum: [0, 1, 2], // 0: Pending, 1: Disetujui, 2: Ditolak
      default: 0,
      index: true,
    },
  },
  { timestamps: true }
);

export const Leave = mongoose.model('Leave', leaveSchema);
