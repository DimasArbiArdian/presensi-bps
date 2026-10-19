import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  Users,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  KeyRound,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const DataMagangPage = () => {
  const [interns, setInterns] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');

  // Modal Create / Edit
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    no_id: '',
    nama_lengkap: '',
    sekolah: '',
    jurusan: '',
    semester: '',
    status: 'Magang',
    no_hp: '',
    password: '',
  });
  const [selectedFoto, setSelectedFoto] = useState(null);
  const [modalError, setModalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchInterns = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/interns?nama_peserta=${search}&status=${selectedProgram}`);
      if (res.data.success) {
        setInterns(res.data.interns);
      }
    } catch (err) {
      console.error('Error fetching interns:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrograms = async () => {
    try {
      const res = await API.get('/programs');
      if (res.data.success) {
        setPrograms(res.data.programs);
      }
    } catch (err) {
      console.error('Error fetching programs:', err);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    fetchInterns();
  }, [search, selectedProgram]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData({
      no_id: '',
      nama_lengkap: '',
      sekolah: '',
      jurusan: '',
      semester: '',
      status: programs[0]?.status || 'Magang',
      no_hp: '',
      password: '12345',
    });
    setSelectedFoto(null);
    setModalError('');
    setShowModal(true);
  };

  const handleOpenEdit = (intern) => {
    setIsEditing(true);
    setFormData({
      no_id: intern.no_id,
      nama_lengkap: intern.nama_lengkap,
      sekolah: intern.sekolah,
      jurusan: intern.jurusan,
      semester: intern.semester || '',
      status: intern.status || 'Magang',
      no_hp: intern.no_hp || '',
      password: '',
    });
    setSelectedFoto(null);
    setModalError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setSubmitting(true);

    const data = new FormData();
    data.append('no_id', formData.no_id);
    data.append('nama_lengkap', formData.nama_lengkap);
    data.append('sekolah', formData.sekolah);
    data.append('jurusan', formData.jurusan);
    data.append('semester', formData.semester);
    data.append('status', formData.status);
    data.append('no_hp', formData.no_hp);
    if (formData.password) {
      data.append('password', formData.password);
    }
    if (selectedFoto) {
      data.append('foto', selectedFoto);
    }

    try {
      if (isEditing) {
        await API.put(`/interns/${formData.no_id}`, data);
      } else {
        await API.post('/interns', data);
      }
      setShowModal(false);
      fetchInterns();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Gagal menyimpan data magang');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (no_id, nama) => {
    if (window.confirm(`Yakin ingin menghapus data peserta "${nama}" (${no_id})?`)) {
      try {
        await API.delete(`/interns/${no_id}`);
        fetchInterns();
      } catch (err) {
        alert(err.response?.data?.message || 'Gagal menghapus data');
      }
    }
  };

  const handleResetPassword = async (no_id, nama) => {
    if (window.confirm(`Reset password untuk "${nama}" menjadi default: 12345?`)) {
      try {
        const res = await API.post(`/interns/${no_id}/reset-password`);
        alert(res.data.message);
      } catch (err) {
        alert(err.response?.data?.message || 'Gagal mereset password');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Data Peserta Magang & PKL</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manajemen akun, data akademik, dan akses peserta magang
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="btn btn-primary"
        >
          <UserPlus size={18} /> Tambah Peserta Baru
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1rem 1.25rem',
          borderRadius: '16px',
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Cari berdasarkan nama peserta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div style={{ width: '200px' }}>
          <select
            className="form-select"
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
          >
            <option value="">Semua Program</option>
            {programs.map((p) => (
              <option key={p.status} value={p.status}>
                {p.status} ({p.keterangan})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>No</th>
              <th>No ID</th>
              <th>Nama Lengkap</th>
              <th>Sekolah / Kampus</th>
              <th>Jurusan</th>
              <th>Smt</th>
              <th>Program</th>
              <th>No WhatsApp</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Memuat data peserta...
                </td>
              </tr>
            ) : interns.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  Tidak ada data peserta ditemukan.
                </td>
              </tr>
            ) : (
              interns.map((intern, idx) => (
                <tr key={intern._id}>
                  <td>{idx + 1}</td>
                  <td>
                    <span style={{ fontWeight: '700', color: 'var(--color-primary-light)' }}>
                      {intern.no_id}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          fontWeight: '700',
                          fontSize: '0.8rem',
                          color: 'var(--color-primary-light)',
                        }}
                      >
                        {intern.foto ? (
                          <img
                            src={`/uploads/magang/${intern.foto}`}
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          intern.nama_lengkap?.charAt(0) || 'P'
                        )}
                      </div>
                      <span style={{ fontWeight: '600' }}>{intern.nama_lengkap}</span>
                    </div>
                  </td>
                  <td>{intern.sekolah}</td>
                  <td>{intern.jurusan}</td>
                  <td>{intern.semester || '-'}</td>
                  <td>
                    <span className="badge badge-info">{intern.status}</span>
                  </td>
                  <td>{intern.no_hp}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(intern)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '6px' }}
                        title="Edit Data"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResetPassword(intern.no_id, intern.nama_lengkap)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '6px', color: 'var(--color-warning)' }}
                        title="Reset Password ke 12345"
                      >
                        <KeyRound size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(intern.no_id, intern.nama_lengkap)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '6px', color: 'var(--color-danger)' }}
                        title="Hapus Peserta"
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

      {/* Modal Add / Edit Intern */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>
                {isEditing ? 'Ubah Data Peserta Magang' : 'Tambah Peserta Magang Baru'}
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">No ID / NIM / NISN</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.no_id}
                      onChange={(e) => setFormData({ ...formData, no_id: e.target.value })}
                      disabled={isEditing}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nama Lengkap</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.nama_lengkap}
                      onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Asal Sekolah / Kampus</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.sekolah}
                      onChange={(e) => setFormData({ ...formData, sekolah: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Jurusan</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.jurusan}
                      onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Semester / Kelas</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Contoh: 6"
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Program</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      {programs.map((p) => (
                        <option key={p.status} value={p.status}>
                          {p.status} ({p.keterangan})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Nomor WhatsApp / HP</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Contoh: 085812345678"
                      value={formData.no_hp}
                      onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      {isEditing ? 'Ganti Password (Opsional)' : 'Password Awal'}
                    </label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder={isEditing ? 'Kosongkan jika tidak diubah' : 'Default: 12345'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Foto Profil (Opsional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-input"
                    onChange={(e) => setSelectedFoto(e.target.files[0])}
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
                  <Save size={16} /> {submitting ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
