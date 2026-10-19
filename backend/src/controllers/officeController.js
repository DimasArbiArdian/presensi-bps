import { OfficeConfig } from '../models/OfficeConfig.js';

// @desc Dapatkan koordinat kantor & radius aktif
// @route GET /api/office
export const getOfficeConfig = async (req, res) => {
  try {
    let office = await OfficeConfig.findOne();
    if (!office) {
      office = await OfficeConfig.create({
        nama_kantor: 'BPS Kota Sukabumi',
        lokasi_kantor: '-6.910091184058985,106.93593094557392',
        radius: 200,
      });
    }
    res.json({ success: true, office });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin memperbarui koordinat & radius kantor
// @route PUT /api/office
export const updateOfficeConfig = async (req, res) => {
  try {
    const { nama_kantor, lokasi_kantor, radius } = req.body;

    if (!lokasi_kantor || !radius) {
      return res.status(400).json({
        success: false,
        message: 'Lokasi koordinat kantor dan radius wajib diisi!',
      });
    }

    let office = await OfficeConfig.findOne();
    if (!office) {
      office = new OfficeConfig();
    }

    office.nama_kantor = nama_kantor || office.nama_kantor;
    office.lokasi_kantor = lokasi_kantor;
    office.radius = Number(radius);

    await office.save();

    res.json({
      success: true,
      message: 'Konfigurasi lokasi dan radius kantor berhasil diperbarui!',
      office,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
