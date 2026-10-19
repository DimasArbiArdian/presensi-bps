import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const internSchema = new mongoose.Schema(
  {
    no_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    nama_lengkap: {
      type: String,
      required: true,
      trim: true,
    },
    sekolah: {
      type: String,
      required: true,
      trim: true,
    },
    jurusan: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: 'Magang',
      trim: true,
    },
    foto: {
      type: String,
      default: null,
    },
    no_hp: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    status_aktif: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

internSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

internSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const Intern = mongoose.model('Intern', internSchema);
