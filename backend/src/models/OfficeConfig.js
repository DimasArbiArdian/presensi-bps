import mongoose from 'mongoose';

const officeConfigSchema = new mongoose.Schema(
  {
    nama_kantor: {
      type: String,
      default: 'BPS Kota Sukabumi',
      trim: true,
    },
    lokasi_kantor: {
      type: String,
      default: '-6.910091184058985,106.93593094557392',
      required: true,
    },
    radius: {
      type: Number, // In meters
      default: 200,
      required: true,
    },
  },
  { timestamps: true }
);

export const OfficeConfig = mongoose.model('OfficeConfig', officeConfigSchema);
