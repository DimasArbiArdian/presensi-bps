import { Program } from '../models/Program.js';

// @desc Get all programs
// @route GET /api/programs
export const getPrograms = async (req, res) => {
  try {
    const { keterangan } = req.query;
    const query = {};
    if (keterangan) {
      query.keterangan = { $regex: keterangan, $options: 'i' };
    }
    const programs = await Program.find(query).sort({ status: 1 });
    res.json({ success: true, programs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create new program
// @route POST /api/programs
export const createProgram = async (req, res) => {
  try {
    const { status, keterangan } = req.body;
    if (!status || !keterangan) {
      return res.status(400).json({ success: false, message: 'Status dan Keterangan wajib diisi!' });
    }

    const existing = await Program.findOne({ status });
    if (existing) {
      return res.status(400).json({ success: false, message: `Program ${status} sudah ada!` });
    }

    const program = await Program.create({ status, keterangan });
    res.status(201).json({ success: true, message: 'Program berhasil ditambahkan!', program });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update program
// @route PUT /api/programs/:status
export const updateProgram = async (req, res) => {
  try {
    const { status } = req.params;
    const { keterangan } = req.body;

    const program = await Program.findOne({ status });
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program tidak ditemukan' });
    }

    program.keterangan = keterangan || program.keterangan;
    await program.save();

    res.json({ success: true, message: 'Program berhasil diperbarui!', program });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete program
// @route DELETE /api/programs/:status
export const deleteProgram = async (req, res) => {
  try {
    const { status } = req.params;
    const program = await Program.findOneAndDelete({ status });
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program tidak ditemukan' });
    }
    res.json({ success: true, message: 'Program berhasil dihapus!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
