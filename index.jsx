import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  FileText,
  Activity,
  Server,
  Monitor,
  Wifi,
  Printer,
  Download,
  Lock,
  LogOut,
  User,
  Calendar,
  Shield, 
  Key,
  Trash2, 
  UserCog,
  Smartphone, // Icon untuk Device
  Globe       // Icon untuk IP
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// --- Helper untuk Generate Tanggal Dinamis ---
const getDateString = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// --- Mock Data Awal (Updated dengan IP & Device) ---
const INITIAL_TICKETS = [
  { id: 1, unit: 'IGD', category: 'Hardware', issue: 'Monitor dokter kedip-kedip', reporter: 'Budi (Perawat)', status: 'Open', date: getDateString(0), priority: 'High', ip: '192.168.10.5', device: 'Windows 10 / Chrome' },
  { id: 2, unit: 'Radiologi', category: 'Network', issue: 'PC PACS tidak connect server', reporter: 'Agus', status: 'Open', date: getDateString(0), priority: 'Critical', ip: '192.168.20.12', device: 'Windows 11 / Firefox' },
  { id: 3, unit: 'Farmasi', category: 'Software', issue: 'SIMRS lambat saat input resep', reporter: 'Siti (Apoteker)', status: 'In Progress', date: getDateString(2), priority: 'High', ip: '192.168.15.8', device: 'Windows 10 / Edge' },
  { id: 4, unit: 'Poli Anak', category: 'Printer', issue: 'Tinta printer habis', reporter: 'Dr. Rina', status: 'Done', date: getDateString(3), priority: 'Low', ip: '192.168.30.2', device: 'MacOS / Safari' },
  { id: 5, unit: 'Kasir', category: 'Hardware', issue: 'Mouse macet', reporter: 'Dina', status: 'Done', date: getDateString(5), priority: 'Low', ip: '192.168.100.45', device: 'Windows 7 / Chrome' },
  { id: 6, unit: 'Rawat Inap Lt.3', category: 'Network', issue: 'WiFi putus nyambung', reporter: 'Joko (Admin)', status: 'Done', date: getDateString(15), priority: 'Medium', ip: '10.50.1.120', device: 'Android / Mobile Chrome' },
  { id: 7, unit: 'Laboratorium', category: 'Software', issue: 'Error bridging LIS', reporter: 'Sarah', status: 'Done', date: getDateString(20), priority: 'High', ip: '192.168.40.11', device: 'Windows 10 / Chrome' },
  { id: 8, unit: 'Manajemen', category: 'User Account', issue: 'Lupa password email', reporter: 'Pak Budi', status: 'Done', date: getDateString(45), priority: 'Medium', ip: '192.168.5.50', device: 'iOS / Safari' },
  { id: 9, unit: 'Poli Gigi', category: 'Hardware', issue: 'PC Mati Total', reporter: 'Drg. Hendi', status: 'Done', date: getDateString(60), priority: 'High', ip: '192.168.35.3', device: 'Windows 11 / Chrome' },
];

const UNITS = [
  'IGD', 'Rawat Inap Lt.1', 'Rawat Inap Lt.2', 'Rawat Inap Lt.3', 'Rawat Inap Lt.4', 'Rawat Inap Lt.5',
  'ICU', 'Perinatologi', 'Kamar Bersalin', 'OKA (Kamar Operasi)',
  'Poli Umum', 'Poli Anak', 'Poli Gigi', 'Poli Spesialis', 'Rehab Medik',
  'Farmasi', 'Gudang Farmasi', 'Laboratorium', 'Radiologi', 'CSSD', 'Rekam Medis',
  'TPP Rajal', 'TPP Ranap', 'Casemix', 'Manajemen', 'Marketing', 'Kantor PT',
  'Kasir', 'Portal Parkir'
];
const CATEGORIES = ['Hardware', 'Software', 'Network', 'Printer', 'User Account', 'Lainnya'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export default function App() {
  const [activeTab, setActiveTab] = useState('form'); 
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [notification, setNotification] = useState(null);
  
  // State untuk Auth
  const [userRole, setUserRole] = useState(null);

  // State untuk Modal Hapus
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);

  // --- Logic Tambah Tiket ---
  const handleSubmitTicket = (ticketData) => {
    const newTicket = {
      id: tickets.length + 1,
      ...ticketData,
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
    };

    setTickets([newTicket, ...tickets]);
    setNotification({ type: 'success', message: 'Tiket berhasil dikirim! Tim IT akan segera mengecek.' });
    
    // Auto switch kembali ke dashboard jika user admin sedang submit tiket test (optional)
    // Tapi karena ini user portal, biarkan di form.
    setTimeout(() => setNotification(null), 3000);
  };

  // --- Logic Update Status ---
  const handleStatusChange = (id, newStatus) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  // --- Logic Hapus Tiket ---
  const handleDeleteClick = (id) => {
    setTicketToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (ticketToDelete) {
      setTickets(tickets.filter(t => t.id !== ticketToDelete));
      setNotification({ type: 'success', message: 'Tiket berhasil dihapus secara permanen.' });
      setTimeout(() => setNotification(null), 3000);
    }
    setShowDeleteModal(false);
    setTicketToDelete(null);
  };

  // --- Logic Navigasi & Auth ---
  const handleDashboardClick = () => {
    if (userRole) {
      setActiveTab('dashboard');
    } else {
      setActiveTab('login');
    }
  };

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setActiveTab('form'); 
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans print:bg-white relative">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-full { width: 100% !important; max-width: none !important; margin: 0 !important; padding: 0 !important; }
          body { -webkit-print-color-adjust: exact; }
          .page-break { page-break-before: always; }
        }
      `}</style>

      {/* Navbar */}
      <nav className="bg-blue-700 text-white shadow-lg sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('form')}>
              <Activity className="h-8 w-8 text-blue-300" />
              <div>
                <h1 className="text-xl font-bold tracking-tight">IT Support RS Prasetya Husada</h1>
                <p className="text-xs text-blue-200">Sistem Pelaporan & Penanganan Kendala Teknis</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('form')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'form' ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-600'}`}
              >
                <div className="flex items-center gap-2">
                  <PlusCircle size={18} />
                  <span>Buat Tiket</span>
                </div>
              </button>
              
              {userRole ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-600'}`}
                  >
                    <div className="flex items-center gap-2">
                      <LayoutDashboard size={18} />
                      <span>Dashboard</span>
                    </div>
                  </button>
                  <div className="hidden md:flex flex-col items-end mr-2">
                    <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">{userRole === 'admin' ? 'Administrator' : 'IT Staff'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium text-red-200 hover:bg-red-600 hover:text-white transition-colors"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleDashboardClick}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'login' ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-600'}`}
                >
                  <div className="flex items-center gap-2">
                    <Lock size={18} />
                    <span>Login Staff</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print-full">
        {notification && (
          <div className={`mb-6 p-4 rounded-lg shadow-sm flex items-center gap-3 no-print ${notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100'}`}>
            <CheckCircle size={20} />
            {notification.message}
          </div>
        )}

        {/* Routing */}
        {activeTab === 'form' && (
          <TicketForm onSubmit={handleSubmitTicket} />
        )}
        
        {activeTab === 'login' && (
          <LoginForm onLogin={handleLoginSuccess} />
        )}

        {activeTab === 'dashboard' && (
          <ITDashboard 
            tickets={tickets} 
            onStatusChange={handleStatusChange} 
            userRole={userRole}
            onDeleteTicket={handleDeleteClick}
          />
        )}
      </main>

      {/* Modal Konfirmasi Hapus */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 transform transition-all scale-100">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <Trash2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Hapus Tiket?</h3>
              <p className="text-slate-500 text-sm mt-2">
                Apakah Anda yakin ingin menghapus data tiket ini secara permanen? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-slate-200"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors shadow-sm focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Komponen: Login Form ---
function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'rsph0341') {
      onLogin('admin');
    } else if (username === 'Support' && password === 'ITRSPH') {
      onLogin('support');
    } else {
      setError('Username atau Password salah!');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh] no-print">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Login Sistem</h2>
          <p className="text-slate-500 text-sm">Masuk sebagai IT Support atau Administrator</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input 
                type="password" 
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 rounded-lg transition-colors shadow-md">
            Masuk Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

// --- Komponen: Form Input Tiket (Dengan Pendeteksi IP & Perangkat) ---
function TicketForm({ onSubmit }) {
  const [hasAccess, setHasAccess] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  
  // State untuk Data Teknis
  const [ipAddress, setIpAddress] = useState('Detecting...');
  const [deviceInfo, setDeviceInfo] = useState('Unknown');

  // Effect untuk Deteksi
  useEffect(() => {
    // 1. Deteksi Device (Browser/OS)
    const userAgent = navigator.userAgent;
    let deviceName = "Unknown Device";
    if (userAgent.indexOf("Win") !== -1) deviceName = "Windows";
    else if (userAgent.indexOf("Mac") !== -1) deviceName = "MacOS";
    else if (userAgent.indexOf("Linux") !== -1) deviceName = "Linux";
    else if (userAgent.indexOf("Android") !== -1) deviceName = "Android";
    else if (userAgent.indexOf("like Mac") !== -1) deviceName = "iOS";
    
    // Simplifikasi Browser
    let browserName = "Browser";
    if(userAgent.indexOf("Chrome") !== -1) browserName = "Chrome";
    else if(userAgent.indexOf("Firefox") !== -1) browserName = "Firefox";
    else if(userAgent.indexOf("Safari") !== -1) browserName = "Safari";
    else if(userAgent.indexOf("Edge") !== -1) browserName = "Edge";

    setDeviceInfo(`${deviceName} / ${browserName}`);

    // 2. Deteksi IP (Menggunakan Public API)
    const fetchIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (err) {
        setIpAddress('192.168.x.x (Local/Offline)'); // Fallback jika gagal
      }
    };
    fetchIp();
  }, []);

  const verifyCode = (e) => {
    e.preventDefault();
    if (accessCode.trim().toUpperCase() === 'HELPIT') {
      setHasAccess(true);
      setError('');
    } else {
      setError('Kode akses salah! Mohon periksa kembali.');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit({
      unit: formData.get('unit'),
      category: formData.get('category'),
      issue: formData.get('issue'),
      reporter: formData.get('reporter'),
      priority: formData.get('priority'),
      ip: ipAddress,
      device: deviceInfo
    });
  };

  if (!hasAccess) {
    return (
      <div className="max-w-md mx-auto mt-10 no-print fade-in">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 p-8 text-center">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Portal Laporan IT</h2>
          <p className="text-slate-500 text-sm mb-6">
            Untuk menjaga keamanan dan mencegah spam, silakan masukkan <b>Kode Akses</b> unit Anda untuk membuka formulir.
          </p>
          
          <form onSubmit={verifyCode} className="space-y-4">
            <div className="relative">
              <Key className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center tracking-[0.2em] font-bold uppercase text-lg transition-all"
                placeholder="KODE AKSES"
                value={accessCode}
                onChange={(e) => {
                  setAccessCode(e.target.value);
                  setError('');
                }}
              />
            </div>
            {error && (
              <div className="flex items-center justify-center gap-2 text-red-600 text-sm font-medium animate-pulse">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
            <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg mt-2">
              Buka Formulir
            </button>
          </form>
          <div className="mt-6 text-xs text-slate-400">
            Hubungi IT Support (Ext. 123) jika belum memiliki kode.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto no-print fade-in">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
        <div className="bg-blue-50 p-6 border-b border-blue-100 text-center md:text-left flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-blue-800 flex items-center justify-center md:justify-start gap-2">
              <FileText className="h-6 w-6" />
              Form Keluhan IT
            </h2>
            <p className="text-blue-600 mt-1">Silakan isi formulir di bawah ini jika unit Anda mengalami kendala teknis.</p>
          </div>
        </div>
        
        {/* Info Deteksi Perangkat (Ditampilkan ke User agar mereka tau) */}
        <div className="bg-blue-50/50 px-6 py-2 border-b border-blue-100 text-xs text-slate-500 flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
          <div className="flex items-center gap-1.5" title="Alamat IP Anda yang terdeteksi">
            <Globe size={14} className="text-blue-400" />
            IP: <span className="font-mono font-medium text-slate-700">{ipAddress}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Perangkat yang Anda gunakan">
            <Smartphone size={14} className="text-blue-400" />
            Device: <span className="font-medium text-slate-700">{deviceInfo}</span>
          </div>
        </div>
        
        <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Nama Pelapor</label>
              <input required name="reporter" type="text" placeholder="Contoh: Sr. Ani" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Unit / Ruangan</label>
              <select required name="unit" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="">-- Pilih Unit --</option>
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Kategori Masalah</label>
              <select required name="category" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Prioritas (Estimasi User)</label>
              <select required name="priority" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Detail Keluhan</label>
            <textarea required name="issue" rows="4" placeholder="Jelaskan masalah secara detail..." className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"></textarea>
            <p className="text-xs text-slate-500">Mohon sertakan Merk/Type aset jika masalah berkaitan dengan hardware.</p>
          </div>

          <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-lg hover:shadow-xl">
            <PlusCircle size={20} />
            Kirim Tiket
          </button>
        </form>
      </div>
    </div>
  );
}

// --- Komponen: Dashboard IT (Admin & Staff View) ---
function ITDashboard({ tickets, onStatusChange, userRole, onDeleteTicket }) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [timeFilter, setTimeFilter] = useState('monthly'); 
  const [searchTerm, setSearchTerm] = useState('');

  // --- Logic Filter Waktu ---
  const filteredByTimeTickets = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return tickets.filter(ticket => {
      const ticketDate = new Date(ticket.date);
      const ticketDateOnly = new Date(ticketDate.getFullYear(), ticketDate.getMonth(), ticketDate.getDate());

      switch (timeFilter) {
        case 'daily': return ticketDateOnly.getTime() === startOfDay.getTime();
        case 'weekly':
          const oneWeekAgo = new Date(now);
          oneWeekAgo.setDate(now.getDate() - 7);
          return ticketDate >= oneWeekAgo;
        case 'monthly': return ticketDate.getMonth() === now.getMonth() && ticketDate.getFullYear() === now.getFullYear();
        case 'yearly': return ticketDate.getFullYear() === now.getFullYear();
        default: return true;
      }
    });
  }, [tickets, timeFilter]);

  // Statistik & Grafik Calculation
  const stats = useMemo(() => {
    return {
      total: filteredByTimeTickets.length,
      open: filteredByTimeTickets.filter(t => t.status === 'Open').length,
      inProgress: filteredByTimeTickets.filter(t => t.status === 'In Progress').length,
      done: filteredByTimeTickets.filter(t => t.status === 'Done').length,
    };
  }, [filteredByTimeTickets]);

  const categoryData = useMemo(() => {
    const counts = {};
    filteredByTimeTickets.forEach(t => { counts[t.category] = (counts[t.category] || 0) + 1; });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [filteredByTimeTickets]);

  const unitData = useMemo(() => {
    const counts = {};
    filteredByTimeTickets.forEach(t => { counts[t.unit] = (counts[t.unit] || 0) + 1; });
    return Object.keys(counts).map(key => ({ name: key, tikets: counts[key] })).sort((a,b) => b.tikets - a.tikets).slice(0, 5);
  }, [filteredByTimeTickets]);

  // Filter Tabel
  const filteredTickets = filteredByTimeTickets.filter(t => {
    const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
    const matchesSearch = t.issue.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.reporter.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getTimeLabel = () => {
    switch (timeFilter) {
      case 'daily': return 'Laporan Harian (' + new Date().toLocaleDateString('id-ID') + ')';
      case 'weekly': return 'Laporan 7 Hari Terakhir';
      case 'monthly': return 'Laporan Bulan ' + new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
      case 'yearly': return 'Laporan Tahun ' + new Date().getFullYear();
      default: return 'Laporan Keseluruhan Data';
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Tanggal", "Status", "Unit", "Pelapor", "IP Address", "Device", "Kategori", "Prioritas", "Keluhan"];
    const rows = filteredTickets.map(t => [
      t.id, t.date, t.status, `"${t.unit}"`, `"${t.reporter}"`, `"${t.ip || '-'}"`, `"${t.device || '-'}"`, t.category, t.priority, `"${t.issue.replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const fileName = `Laporan_IT_${timeFilter}_${new Date().toISOString().slice(0,10)}.csv`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => { window.print(); };
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-8 fade-in">
      
      {/* Header Print */}
      <div className="hidden print:block mb-8 text-center border-b pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Laporan IT Support</h1>
        <h2 className="text-xl text-slate-700">RS Prasetya Husada</h2>
        <p className="text-lg font-medium text-slate-800 mt-2">{getTimeLabel()}</p>
        <p className="text-sm text-slate-500">Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-4 no-print">
        <div>
           <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
             <LayoutDashboard className="text-blue-600" />
             Dashboard Monitoring
           </h2>
           <div className="flex items-center gap-2 mt-1">
             {userRole === 'admin' ? (
                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-bold border border-purple-200 flex items-center gap-1">
                  <UserCog size={12} /> Mode Administrator
                </span>
             ) : (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold border border-blue-200 flex items-center gap-1">
                  <User size={12} /> Mode Staff
                </span>
             )}
             <span className="text-slate-500 text-sm">| {getTimeLabel()}</span>
           </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center">
          <div className="relative w-full sm:w-auto">
            <Calendar className="absolute left-3 top-2.5 text-slate-500" size={18} />
            <select 
              className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-slate-50 hover:bg-white transition-colors w-full cursor-pointer"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="daily">Hari Ini</option>
              <option value="weekly">7 Hari Terakhir</option>
              <option value="monthly">Bulan Ini</option>
              <option value="yearly">Tahun Ini</option>
              <option value="all">Semua Waktu</option>
            </select>
          </div>
          <div className="h-8 w-px bg-slate-300 hidden sm:block"></div>
          <button onClick={handleExportCSV} className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm w-full sm:w-auto">
            <Download size={18} /> Export Excel
          </button>
          <button onClick={handlePrint} className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm w-full sm:w-auto">
            <Printer size={18} /> Print Laporan
          </button>
        </div>
      </div>

      {/* Cards Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard icon={<Server className="text-blue-500" />} title="Total Tiket" value={stats.total} color="bg-blue-50 border-blue-200" />
        <StatCard icon={<AlertCircle className="text-red-500" />} title="Open (Belum)" value={stats.open} color="bg-red-50 border-red-200" />
        <StatCard icon={<Clock className="text-yellow-600" />} title="Sedang Dikerjakan" value={stats.inProgress} color="bg-yellow-50 border-yellow-200" />
        <StatCard icon={<CheckCircle className="text-green-500" />} title="Selesai" value={stats.done} color="bg-green-50 border-green-200" />
      </div>

      {/* Visualisasi Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 print:border-none print:shadow-none">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Monitor size={20} /> Tiket per Unit (Top 5)
          </h3>
          <div className="h-64">
            {unitData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={unitData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="tikets" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">Tidak ada data untuk periode ini</div>
            )}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 print:border-none print:shadow-none">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Wifi size={20} /> Kategori Masalah
          </h3>
          <div className="h-64">
             {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {categoryData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
             ) : (
              <div className="flex items-center justify-center h-full text-slate-400">Tidak ada data untuk periode ini</div>
            )}
          </div>
        </div>
      </div>

      {/* Tabel Tiket */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border-none print:mt-4">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print">
          <h3 className="text-lg font-bold text-slate-800">Detail Tiket ({filteredTickets.length})</h3>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input type="text" placeholder="Cari keluhan / unit..." className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full" onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <select className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white w-full" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All">Semua Status</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>
        </div>

        <h3 className="hidden print:block text-lg font-bold text-slate-800 mb-2 mt-4 px-6 pt-4">Rincian Tiket Masuk</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider print:bg-gray-100">
                <th className="p-4 border-b border-slate-200 font-semibold">Status</th>
                <th className="p-4 border-b border-slate-200 font-semibold">Tanggal</th>
                <th className="p-4 border-b border-slate-200 font-semibold">Unit & Pelapor</th>
                <th className="p-4 border-b border-slate-200 font-semibold">Keluhan</th>
                <th className="p-4 border-b border-slate-200 font-semibold">Prioritas</th>
                <th className="p-4 border-b border-slate-200 font-semibold no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50 transition-colors print:hover:bg-transparent">
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)} print:border-0 print:pl-0`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap text-slate-500">{ticket.date}</td>
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{ticket.unit}</div>
                      <div className="text-xs text-slate-500 mb-1">{ticket.reporter}</div>
                      
                      {/* IP & Device Info (Visible for Admin/Support) */}
                      <div className="flex flex-col gap-1 mt-1.5 pt-1.5 border-t border-slate-100">
                         <div className="flex items-center gap-1.5 text-[10px] text-slate-400" title="IP Address">
                           <Globe size={10} /> {ticket.ip || 'N/A'}
                         </div>
                         <div className="flex items-center gap-1.5 text-[10px] text-slate-400" title="User Device">
                           <Smartphone size={10} /> {ticket.device || 'N/A'}
                         </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200 print:border-gray-300">{ticket.category}</span>
                      </div>
                      <p className="line-clamp-2">{ticket.issue}</p>
                    </td>
                    <td className="p-4">
                      <span className={`font-semibold ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
                    </td>
                    <td className="p-4 no-print">
                      <div className="flex items-center gap-2">
                        {ticket.status === 'Done' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed" title="Tiket yang sudah selesai tidak dapat diubah statusnya">
                            <Lock size={12} /> Selesai
                          </span>
                        ) : (
                          <select 
                            className="text-sm border border-slate-300 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:border-blue-400 shadow-sm"
                            value={ticket.status}
                            onChange={(e) => onStatusChange(ticket.id, e.target.value)}
                          >
                            <option value="Open">Set Open</option>
                            <option value="In Progress">Proses</option>
                            <option value="Done">Selesai</option>
                          </select>
                        )}
                        
                        {/* Tombol Hapus Khusus Admin */}
                        {userRole === 'admin' && (
                          <button 
                            onClick={() => onDeleteTicket(ticket.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-md border border-transparent hover:border-red-200 transition-colors"
                            title="Hapus Tiket (Admin Only)"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">Tidak ada tiket untuk periode/filter ini.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components & Functions ---

function StatCard({ icon, title, value, color }) {
  return (
    <div className={`p-6 rounded-xl border ${color} shadow-sm flex items-center justify-between print:border-gray-300`}>
      <div>
        <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
        <h4 className="text-3xl font-bold text-slate-800">{value}</h4>
      </div>
      <div className="p-3 bg-white bg-opacity-60 rounded-full print:hidden">{icon}</div>
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case 'Done': return 'bg-green-100 text-green-800 border border-green-200';
    case 'In Progress': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    default: return 'bg-red-100 text-red-800 border border-red-200';
  }
}

function getPriorityColor(priority) {
  switch (priority) {
    case 'Critical': return 'text-red-600';
    case 'High': return 'text-orange-600';
    case 'Medium': return 'text-blue-600';
    default: return 'text-slate-500';
  }
}
