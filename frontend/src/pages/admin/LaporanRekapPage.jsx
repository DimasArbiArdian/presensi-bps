import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  FileText,
  FileSpreadsheet,
  Printer,
  Download,
  Calendar,
  Users,
  Search,
} from 'lucide-react';
import { BpsLogo } from '../../components/BpsLogo';

export const LaporanRekapPage = () => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [activeTab, setActiveTab] = useState('rekap'); // 'rekap' or 'individual'

  // Shared state
  const [bulan, setBulan] = useState(currentMonth);
  const [tahun, setTahun] = useState(currentYear);
  const [interns, setInterns] = useState([]);

  // Individual Report state
  const [selectedNoId, setSelectedNoId] = useState('');
  const [indivData, setIndivData] = useState(null);
  const [indivLoading, setIndivLoading] = useState(false);

  // Rekap Matrix state
  const [matrixData, setMatrixData] = useState(null);
  const [matrixLoading, setMatrixLoading] = useState(false);

  const monthOptions = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
  ];

  // Fetch interns for dropdown
  useEffect(() => {
    const fetchInternList = async () => {
      try {
        const res = await API.get('/interns');
        if (res.data.success) {
          setInterns(res.data.interns);
          if (res.data.interns.length > 0 && !selectedNoId) {
            setSelectedNoId(res.data.interns[0].no_id);
          }
        }
      } catch (err) {
        console.error('Error fetching intern list:', err);
      }
    };
    fetchInternList();
  }, []);

  // Fetch Matrix
  const fetchMatrix = async () => {
    setMatrixLoading(true);
    try {
      const res = await API.get(`/reports/rekap-matrix?bulan=${bulan}&tahun=${tahun}`);
      if (res.data.success) {
        setMatrixData(res.data);
      }
    } catch (err) {
      console.error('Error fetching rekap matrix:', err);
    } finally {
      setMatrixLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'rekap') {
      fetchMatrix();
    }
  }, [activeTab, bulan, tahun]);

  // Fetch Individual
  const fetchIndividual = async () => {
    if (!selectedNoId) return;
    setIndivLoading(true);
    try {
      const res = await API.get(
        `/reports/individual?no_id=${selectedNoId}&bulan=${bulan}&tahun=${tahun}`
      );
      if (res.data.success) {
        setIndivData(res.data);
      }
    } catch (err) {
      console.error('Error fetching individual report:', err);
    } finally {
      setIndivLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'individual' && selectedNoId) {
      fetchIndividual();
    }
  }, [activeTab, selectedNoId, bulan, tahun]);

  const handleExportExcel = () => {
    window.open(`/api/reports/export-excel?bulan=${bulan}&tahun=${tahun}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Hide controls when printing */}
      <div className="no-print" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Laporan & Rekapitulasi Presensi</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Cetak laporan resmi format A4 dan export rekap bulanan ke spreadsheet Microsoft Excel (.xlsx)
        </p>

        {/* Tab Selection */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('rekap')}
            className={`btn ${activeTab === 'rekap' ? 'btn-primary' : 'btn-outline'} btn-sm`}
          >
            <FileSpreadsheet size={16} /> Matriks Rekapitulasi (1 - 31 Hari)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('individual')}
            className={`btn ${activeTab === 'individual' ? 'btn-primary' : 'btn-outline'} btn-sm`}
          >
            <FileText size={16} /> Laporan Individu Resmi (Kop BPS)
          </button>
        </div>

        {/* Filter Controls */}
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem',
            borderRadius: '16px',
            marginTop: '1rem',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
          }}
        >
          <div className="form-group" style={{ margin: 0, minWidth: '160px' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Bulan</label>
            <select
              className="form-select"
              value={bulan}
              onChange={(e) => setBulan(Number(e.target.value))}
            >
              {monthOptions.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0, width: '110px' }}>
            <label className="form-label" style={{ fontSize: '0.8rem' }}>Tahun</label>
            <select
              className="form-select"
              value={tahun}
              onChange={(e) => setTahun(Number(e.target.value))}
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {activeTab === 'individual' && (
            <div className="form-group" style={{ margin: 0, minWidth: '220px' }}>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Pilih Peserta Magang</label>
              <select
                className="form-select"
                value={selectedNoId}
                onChange={(e) => setSelectedNoId(e.target.value)}
              >
                {interns.map((i) => (
                  <option key={i.no_id} value={i.no_id}>
                    {i.nama_lengkap} ({i.no_id})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto' }}>
            {activeTab === 'rekap' && (
              <button
                type="button"
                onClick={handleExportExcel}
                className="btn btn-secondary"
              >
                <Download size={16} /> Export ke Excel (.xlsx)
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-primary"
            >
              <Printer size={16} /> Cetak Dokumen
            </button>
          </div>
        </div>
      </div>

      {/* PRINT-READY CONTENT */}
      {activeTab === 'rekap' ? (
        /* TAB 1: REKAP MATRIX */
        <div style={{ backgroundColor: '#ffffff', color: '#000', padding: '1.5rem', borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#1e3a8a' }}>
              REKAPITULASI PRESENSI PESERTA MAGANG / PKL
            </h3>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: '4px 0 0', color: '#333' }}>
              BADAN PUSAT STATISTIK KOTA SUKABUMI
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#666', margin: '2px 0 0' }}>
              Periode: {monthOptions.find((m) => m.value === bulan)?.label} {tahun}
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.75rem',
                border: '1px solid #cbd5e1',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#1e3a8a', color: '#fff', textAlign: 'center' }}>
                  <th style={{ padding: '6px', border: '1px solid #cbd5e1' }}>No</th>
                  <th style={{ padding: '6px', border: '1px solid #cbd5e1', minWidth: '90px' }}>No ID</th>
                  <th style={{ padding: '6px', border: '1px solid #cbd5e1', minWidth: '150px' }}>Nama Lengkap</th>
                  <th style={{ padding: '6px', border: '1px solid #cbd5e1', minWidth: '70px' }}>Program</th>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <th key={d} style={{ padding: '4px 2px', border: '1px solid #cbd5e1', width: '26px' }}>
                      {d}
                    </th>
                  ))}
                  <th style={{ padding: '6px', border: '1px solid #cbd5e1' }}>Hadir</th>
                  <th style={{ padding: '6px', border: '1px solid #cbd5e1' }}>Telat</th>
                </tr>
              </thead>
              <tbody>
                {matrixLoading ? (
                  <tr>
                    <td colSpan={36} style={{ textAlign: 'center', padding: '2rem' }}>
                      Memuat matriks kehadiran...
                    </td>
                  </tr>
                ) : matrixData?.matrix?.length === 0 ? (
                  <tr>
                    <td colSpan={36} style={{ textAlign: 'center', padding: '2rem' }}>
                      Tidak ada data peserta magang aktif.
                    </td>
                  </tr>
                ) : (
                  matrixData?.matrix?.map((row, idx) => (
                    <tr key={row.intern.no_id} style={{ textAlign: 'center', backgroundColor: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                      <td style={{ padding: '4px', border: '1px solid #cbd5e1' }}>{idx + 1}</td>
                      <td style={{ padding: '4px', border: '1px solid #cbd5e1', fontWeight: '600' }}>{row.intern.no_id}</td>
                      <td style={{ padding: '4px', border: '1px solid #cbd5e1', textAlign: 'left', fontWeight: '600' }}>
                        {row.intern.nama_lengkap}
                      </td>
                      <td style={{ padding: '4px', border: '1px solid #cbd5e1' }}>{row.intern.status}</td>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                        const cell = row.days[day];
                        const isLate = cell && cell.jam_in > '08:00:00';
                        return (
                          <td
                            key={day}
                            style={{
                              padding: '2px',
                              border: '1px solid #cbd5e1',
                              backgroundColor: isLate ? '#fee2e2' : cell ? '#dcfce7' : 'transparent',
                              color: isLate ? '#991b1b' : cell ? '#166534' : '#94a3b8',
                              fontWeight: cell ? 'bold' : 'normal',
                              fontSize: '0.65rem',
                            }}
                            title={cell ? `Jam: ${cell.jam_in} - ${cell.jam_out || '-'}` : 'Tidak hadir'}
                          >
                            {cell ? '✓' : '-'}
                          </td>
                        );
                      })}
                      <td style={{ padding: '4px', border: '1px solid #cbd5e1', fontWeight: 'bold', color: '#166534' }}>
                        {row.totalHadir}
                      </td>
                      <td style={{ padding: '4px', border: '1px solid #cbd5e1', fontWeight: 'bold', color: '#991b1b' }}>
                        {row.totalTerlambat}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* TAB 2: INDIVIDUAL OFFICIAL A4 REPORT WITH BPS LETTERHEAD */
        <div
          style={{
            backgroundColor: '#ffffff',
            color: '#000',
            padding: '2.5rem',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-md)',
            maxWidth: '900px',
            margin: '0 auto',
            fontFamily: 'serif',
          }}
        >
          {/* KOP SURAT BPS RESMI */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              borderBottom: '3px double #000',
              paddingBottom: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ marginRight: '1.5rem', display: 'flex', alignItems: 'center' }}>
              <BpsLogo size={85} showText={false} />
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, textTransform: 'uppercase' }}>
                BADAN PUSAT STATISTIK KOTA SUKABUMI
              </h2>
              <p style={{ fontSize: '0.85rem', margin: '4px 0 0' }}>
                Jl. Selabintana No. 12, Cikole, Kota Sukabumi, Jawa Barat 43114
              </p>
              <p style={{ fontSize: '0.8rem', color: '#555', margin: '2px 0 0' }}>
                Telepon: (0266) 222143 | Email: bps3272@bps.go.id | Website: sukabumikota.bps.go.id
              </p>
            </div>
          </div>

          {/* JUDUL LAPORAN */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', textDecoration: 'underline', margin: 0 }}>
              LAPORAN KEHADIRAN PESERTA MAGANG
            </h3>
            <p style={{ fontSize: '0.9rem', margin: '4px 0 0' }}>
              Periode: <strong>{indivData?.namaBulan || ''} {tahun}</strong>
            </p>
          </div>

          {/* IDENTITAS PESERTA */}
          <div style={{ marginBottom: '1.25rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td style={{ width: '180px', fontWeight: 'bold' }}>Nomor ID / NIM</td>
                  <td style={{ width: '15px' }}>:</td>
                  <td>{indivData?.intern?.no_id}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Nama Lengkap</td>
                  <td>:</td>
                  <td style={{ fontWeight: 'bold' }}>{indivData?.intern?.nama_lengkap}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Asal Kampus / Sekolah</td>
                  <td>:</td>
                  <td>{indivData?.intern?.sekolah}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Jurusan / Program</td>
                  <td>:</td>
                  <td>{indivData?.intern?.jurusan} &bull; {indivData?.intern?.status}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TABEL PRESENSI */}
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.85rem',
              marginBottom: '2rem',
              border: '1px solid #000',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'center' }}>
                <th style={{ border: '1px solid #000', padding: '6px' }}>No</th>
                <th style={{ border: '1px solid #000', padding: '6px' }}>Tanggal</th>
                <th style={{ border: '1px solid #000', padding: '6px' }}>Jam Masuk</th>
                <th style={{ border: '1px solid #000', padding: '6px' }}>Jam Pulang</th>
                <th style={{ border: '1px solid #000', padding: '6px' }}>Ketepatan Waktu</th>
                <th style={{ border: '1px solid #000', padding: '6px' }}>Catatan Kegiatan</th>
              </tr>
            </thead>
            <tbody>
              {indivLoading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    Memuat data presensi individu...
                  </td>
                </tr>
              ) : indivData?.attendances?.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    Tidak ada catatan presensi pada bulan ini.
                  </td>
                </tr>
              ) : (
                indivData?.attendances?.map((att, idx) => (
                  <tr key={att._id} style={{ textAlign: 'center' }}>
                    <td style={{ border: '1px solid #000', padding: '6px' }}>{idx + 1}</td>
                    <td style={{ border: '1px solid #000', padding: '6px' }}>{att.tgl_presensi}</td>
                    <td style={{ border: '1px solid #000', padding: '6px' }}>{att.jam_in || '-'}</td>
                    <td style={{ border: '1px solid #000', padding: '6px' }}>{att.jam_out || '-'}</td>
                    <td style={{ border: '1px solid #000', padding: '6px' }}>{att.status_waktu}</td>
                    <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'left' }}>
                      {att.kegiatan_in || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* TANDA TANGAN PEJABAT */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', fontSize: '0.9rem' }}>
            <div style={{ textAlign: 'center', width: '220px' }}>
              <p style={{ margin: 0 }}>Peserta Magang,</p>
              <div style={{ height: '70px' }} />
              <p style={{ margin: 0, fontWeight: 'bold', textDecoration: 'underline' }}>
                {indivData?.intern?.nama_lengkap}
              </p>
              <p style={{ margin: 0, fontSize: '0.8rem' }}>NIM: {indivData?.intern?.no_id}</p>
            </div>

            <div style={{ textAlign: 'center', width: '250px' }}>
              <p style={{ margin: 0 }}>Sukabumi, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p style={{ margin: 0 }}>Pembimbing Lapangan BPS,</p>
              <div style={{ height: '70px' }} />
              <p style={{ margin: 0, fontWeight: 'bold', textDecoration: 'underline' }}>
                Kepala Subbagian Umum
              </p>
              <p style={{ margin: 0, fontSize: '0.8rem' }}>NIP. 19800101 200501 1 002</p>
            </div>
          </div>
        </div>
      )}

      {/* Print Style Rule */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .admin-sidebar {
            display: none !important;
          }
          body {
            background-color: #fff !important;
            color: #000 !important;
          }
          .admin-content {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};
