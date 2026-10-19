import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
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
    tgl_presensi: {
      type: String, // Format: YYYY-MM-DD
      required: true,
      index: true,
    },
    jam_in: {
      type: String, // Format: HH:mm:ss
      default: null,
    },
    jam_out: {
      type: String, // Format: HH:mm:ss
      default: null,
    },
    foto_in: {
      type: String,
      default: null,
    },
    foto_out: {
      type: String,
      default: null,
    },
    lokasi_in: {
      type: String, // Format: "-6.9181652,106.93152"
      default: null,
    },
    lokasi_out: {
      type: String,
      default: null,
    },
    jarak_in: {
      type: Number, // In meters
      default: 0,
    },
    jarak_out: {
      type: Number, // In meters
      default: 0,
    },
    kegiatan_in: {
      type: String,
      default: 'Tidak ada kegiatan',
    },
    kegiatan_out: {
      type: String,
      default: 'Tidak ada kegiatan',
    },
    status_waktu: {
      type: String,
      enum: ['Tepat Waktu', 'Terlambat'],
      default: 'Tepat Waktu',
    },
  },
  { timestamps: true }
);

// Compound index untuk no_id & tgl_presensi
attendanceSchema.index({ no_id: 1, tgl_presensi: 1 });

export const Attendance = mongoose.model('Attendance', attendanceSchema);
