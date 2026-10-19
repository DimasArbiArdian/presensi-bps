import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const MasterProgramPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({ status: '', keterangan: '' });
  const [modalError, setModalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await API.get('/programs');
      if (res.data.success) {
        setPrograms(res.data.programs);
      }
    } catch (err) {
      console.error('Error fetching programs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData({ status: '', keterangan: '' });
    setModalError('');
    setShowModal(true);
  };

  const handleOpenEdit = (program) => {
    setIsEditing(true);
    setFormData({ status: program.status, keterangan: program.keterangan });
    setModalError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setSubmitting(true);

    try {
      if (isEditing) {
        await API.put(`/programs/${formData.status}`, { keterangan: formData.keterangan });
      } else {
        await API.post('/programs', formData);
      }
      setShowModal(false);
      fetchPrograms();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Gagal menyimpan program');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (status) => {
    if (window.confirm(`Yakin ingin menghapus program "${status}"?`)) {
      try {
        await API.delete(`/programs/${status}`);
        fetchPrograms();
      } catch (err) {
        alert(err.response?.data?.message || 'Gagal menghapus program');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Master Program Magang</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Pengaturan kategori status kegiatan (Magang, PKL, dll)
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="btn btn-primary"
        >
          <Plus size={18} /> Tambah Program Baru
        </button>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>No</th>
              <th>Kode / Status Program</th>
              <th>Keterangan Lengkap</th>
              <th style={{ width: '120px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Memuat master program...
                </td>
              </tr>
            ) : programs.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Belum ada program terdaftar.
                </td>
              </tr>
            ) : (
              programs.map((prog, idx) => (
                <tr key={prog._id}>
                  <td>{idx + 1}</td>
                  <td>
                    <span className="badge badge-info" style={{ fontSize: '0.85rem' }}>
                      {prog.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: '600' }}>{prog.keterangan}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(prog)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '6px' }}
                        title="Edit Program"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(prog.status)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '6px', color: 'var(--color-danger)' }}
                        title="Hapus Program"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add / Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>
                {isEditing ? 'Ubah Program' : 'Tambah Program Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn btn-outline btn-sm"
                style={{ padding: '4px', borderRadius: '50%' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {modalError && (
                  <div
                    style={{
                      backgroundColor: 'var(--color-danger-bg)',
                      color: 'var(--color-danger)',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      marginBottom: '1rem',
                    }}
                  >
                    {modalError}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Kode / Status Program</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Contoh: Magang, PKL, KKN"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    disabled={isEditing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Keterangan Lengkap</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Contoh: Praktik Kerja Lapangan Mahasiswa"
                    value={formData.keterangan}
                    onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  <Save size={16} /> {submitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
