import type { EcoProduct, MapPoint, Order } from './types.ts';

/* --------------------------------------------------------------------------
   Public landing content
   -------------------------------------------------------------------------- */
export const PUBLIC_NAV = [
	{ href: '/', label: 'Dashboard' },
	{ href: '/#peta', label: 'Peta Heatmap' },
	{ href: '/toko', label: 'Eco-Shop' },
	{ href: '/kerja-bakti', label: 'Kerja Bakti' },
	{ href: '/profil', label: 'Profil Saya' }
];

export const HERO_STATS = [
	{ value: 15400, display: '15.4K+', label: 'Laporan Tuntas', sub: 'Malang & Batu' },
	{ value: 94.8, display: '94.8%', label: 'Akurasi AI', sub: 'Deteksi Volume Sampah' },
	{ value: 24, display: '24 Min', label: 'Rata-rata Respon', sub: 'Tim Reaksi Cepat' }
];

export const STEPS = [
	{
		n: '01',
		title: 'Lihat. Foto. Lapor.',
		body: 'Buka website DrainAct tanpa perlu login. Ambil foto sampah atau saluran tersumbat, kunci lokasi GPS, dan kirim dalam <30 detik.',
		foot: 'Rata-rata <30 detik',
		icon: 'camera'
	},
	{
		n: '02',
		title: 'DLH & Warga Merespons',
		body: 'AI memvalidasi laporan. Sampah besar dikirim ke DLH untuk pembersihan armada; sampah mikro otomatis memicu ajakan Kerja Bakti warga.',
		foot: 'Verifikasi AI & Disposisi Cepat',
		icon: 'truck'
	},
	{
		n: '03',
		title: 'Pantau di Peta Heatmap',
		body: 'Laporan muncul di peta interaktif. Tetangga dan DLH memantau status penanganan secara real-time hingga area kembali bersih.',
		foot: 'Real-time · data terbuka',
		icon: 'map'
	}
];

export const MODULES = [
	{ n: '01', title: 'Beranda', body: 'Pintu masuk publik, informasi misi bebas sampah & pencegahan banjir.', icon: 'home' },
	{ n: '02', title: 'WhatsApp Bot', body: 'Lapor lewat chat WhatsApp tanpa install aplikasi.', icon: 'message' },
	{ n: '03', title: 'AI Waste Checker', body: 'Filter AI untuk validasi foto sampah asli dan deteksi tingkat keparahan.', icon: 'cpu' },
	{ n: '04', title: 'Formulir Laporan', body: 'Formulir simpel memuat foto bukti, estimasi volume, dan deskripsi.', icon: 'file-text' },
	{ n: '05', title: 'Input Lokasi', body: 'Auto-lock koordinat GPS presisi agar lokasi sampah/sumbatan akurat.', icon: 'map-pin' },
	{ n: '06', title: 'Heat Map', body: 'Peta visualisasi sebaran tumpukan sampah & titik rawan banjir real-time.', icon: 'map' },
	{ n: '07', title: 'Status Laporan', body: 'Lapor → Disposisi → Handled (Before-After). Lacak status langsung.', icon: 'activity' },
	{ n: '08', title: 'Dashboard DLH', body: 'Panel armada DLH untuk tinjau lokasi, atur rute, dan upload bukti bersih.', icon: 'building' },
	{ n: '09', title: 'Ajak Kerja Bakti', body: 'Fitur inisiasi gotong royong warga untuk penanganan sampah skala kecil.', icon: 'users' },
	{ n: '10', title: 'Analitik', body: 'Statistik volume sampah, hotspot daerah, dan efisiensi respon DLH.', icon: 'bar-chart' }
];

export const HERO_MAP_POINTS: MapPoint[] = [
	{ x: 28, y: 62, sev: 'parah', label: 'Lowokwaru', count: 14 },
	{ x: 46, y: 42, sev: 'sedang', label: 'Klojen', count: 9 },
	{ x: 63, y: 30, sev: 'kerja', label: 'Blimbing', count: 6 },
	{ x: 58, y: 68, sev: 'parah', label: 'Sukun', count: 11 },
	{ x: 78, y: 56, sev: 'sedang', label: 'Kedungkandang', count: 7 }
];

export const PUBLIC_TESTIMONIALS = [
	{
		name: 'Sarah M.',
		role: 'Warga Klojen',
		text: 'Laporan selokan mampet saya ditindaklanjuti dalam 20 menit. Tim DLH datang dengan truk hisap, dan saya dapat poin untuk belanja kompos.'
	},
	{
		name: 'Alex K.',
		role: 'Relawan RW 03',
		text: 'Peta heatmap-nya bikin kerja bakti jadi terarah. Kami tahu titik mana yang paling parah dan bisa koordinasi langsung dengan DLH.'
	},
	{
		name: 'James L.',
		role: 'Penggerak Bank Sampah',
		text: 'Semenjak pakai DrainAct, setoran sampah warga naik dua kali lipat. Poinnya bisa ditukar sembako dan kompos di Eco-Shop.'
	},
	{
		name: 'Mooen',
		role: 'Ketua RT 04 Sukun',
		text: 'Dulu kami harus telepon dinas berkali-kali. Sekarang cukup foto dan kirim, statusnya transparan sampai petugas selesai.'
	}
];

export const FOOTER_LINKS = [
	{ title: 'HIDROLOGI & DRAINASE', links: ['Peta Telemetri Genangan GIS', 'Sensor Debit Air Kali Bantas', 'CCTV Inspeksi Culvert', 'Status Siaga Banjir BMKG'] },
	{ title: 'LAYANAN & REGULASI', links: ['Pelaporan Warga Cepat', 'Bank Sampah & Daur Ulang', 'Kepatuhan Arsitektur SPBE', 'SOP Tanggap Darurat PU PR'] },
	{ title: 'PEMERINTAH MITRA', links: ['Pemerintah Kota Malang', 'Pemerintah Kabupaten Malang', 'Pemerintah Kota Batu', 'Dinas Lingkungan Hidup Jatim'] }
];

export const ECO_PRODUCTS: EcoProduct[] = [
	{ id: 1, name: 'T-shirt with Tape Details', image: '/img/eco-1.webp', price: 120, rating: 4.5 },
	{ id: 2, name: 'Skinny Fit Jeans', image: '/img/eco-2.webp', price: 240, compareAt: 260, discount: 20, rating: 3.5 },
	{ id: 3, name: 'Checkered Shirt', image: '/img/eco-3.webp', price: 180, rating: 4.5 },
	{ id: 4, name: 'Sleeve Striped T-shirt', image: '/img/eco-4.webp', price: 130, compareAt: 160, discount: 30, rating: 4.5 },
	{ id: 5, name: 'Vertical Striped Shirt', image: '/img/eco-5.webp', price: 212, compareAt: 232, discount: 20, rating: 5 },
	{ id: 6, name: 'Courage Graphic T-shirt', image: '/img/eco-6.webp', price: 145, rating: 4 },
	{ id: 7, name: 'Loose Fit Bermuda Shorts', image: '/img/eco-7.webp', price: 80, rating: 3 },
	{ id: 8, name: 'Faded Skinny Jeans', image: '/img/eco-8.webp', price: 210, rating: 4.5 }
];

/* --------------------------------------------------------------------------
   Resident hub
   -------------------------------------------------------------------------- */
export const HUB_STATS = [
	{ value: 2, suffix: ' Kasus', label: 'Laporan Aktif Diproses', icon: 'activity' },
	{ value: 28, suffix: ' Selesai', label: 'Insiden Tertangani Tuntas', icon: 'check-circle' },
	{ value: 1250, suffix: ' Pts', label: 'Total Eco-Points Terkumpul', icon: 'coins' },
	{ value: 6, suffix: ' Kali', label: 'Partisipasi Kerja Bakti RT', icon: 'users' }
];

export const HUB_SERVICES = [
	{ title: 'AI Computer Vision', body: 'Cukup bidik kamera foto tumpukan sampah atau selokan, algoritma menilai jenis volume, tingkat risiko, dan klasifikasi otomatis dalam 3 detik.', link: 'Uji Coba Deteksi', icon: 'cpu' },
	{ title: 'Sensor Silt & Muka Air', body: 'Pantau grafik ketebalan sedimen lumpur dan elevasi air secara berkala pada gorong-gorong utama jalan protokol Kota Malang.', link: 'Lihat Data Sensor', icon: 'activity' },
	{ title: 'Pelacakan Truk GPS', body: 'Transparansi armada dinas kebersihan. Pantau jadwal rute pengambilan sampah domestik dan radius armada satgas tanggap darurat.', link: 'Lacak Posisi Truk', icon: 'truck' },
	{ title: 'Eco-Shop & Tukar Poin', body: 'Tukarkan akumulasi Eco-Points dari pelaporan terverifikasi dengan saldo e-wallet, voucher sembako, atau produk ramah lingkungan mitra.', link: 'Katalog Rewards', icon: 'shopping-bag' },
	{ title: 'Notifikasi Dini Banjir', body: 'Peringatan siaga dini otomatis berbasis lokasi saat intensitas curah hujan tinggi dan debit saluran mencapai batas ambang 80%.', link: 'Atur Radius Siaga', icon: 'bell' },
	{ title: 'Agenda Gotong Royong RT/RW', body: 'Koordinasikan jadwal kerja bakti pembersihan selokan antarwarga tingkat kelurahan dengan dukungan armada angkut gratis dari DLH.', link: 'Jadwal Komunitas', icon: 'calendar' }
];

/* --------------------------------------------------------------------------
   DLH command center
   -------------------------------------------------------------------------- */
export const DLH_METRICS = [
	{ label: 'Laporan Masuk Hari Ini', value: '84', note: '+18% dari kemarin', sub: '71 Tervalidasi Warga · 13 Telemetri Otomatis' },
	{ label: 'Titik Kritis / Mampet Severe', value: '6', note: 'Titik Butuh Segera', sub: 'Lowokwaru (3), Klojen (2), Blimbing (1)' },
	{ label: 'Armada Disposisi Aktif', value: '14', note: 'dari 18 Unit Terdaftar', sub: '10 Truk Hisap, 4 Dump Truck' },
	{ label: 'Rata-rata Respon Armada', value: '38', note: 'Menit', sub: 'SLA <45m Tercapai · Target Perwali No. 24/2023' }
];

export const DLH_ROWS = [
	{
		id: '#RPT-MLG-1082', time: '08:14 WIB', ago: '9 mnt lalu', sev: 'Parah', severity: 94,
		estimate: 'Est. Luapan: 15-20 Mnt', loc: 'Jl. Soekarno-Hatta No. 45', area: 'Kec. Lowokwaru (Simpang Krida)',
		gps: '-7.9431, 116.6174', channel: 'Culvert 1.8m', fleet: 'Armada Alpha', crew: '4 Personel · Truk Hisap 03',
		status: 'En Route (3.2 km)', tone: 'info', tag: 'Tersumbat Kayu & Kasur', actions: ['Disposisi Ulang', 'Before-After']
	},
	{
		id: '#RPT-MLG-1079', time: '07:50 WIB', ago: '33 mnt lalu', sev: 'Parah', severity: 88,
		estimate: 'Est. Limpasan: Jembatan', loc: 'Jembatan Kali Mewek, Jl. Borobudur', area: 'Kec. Blimbing',
		gps: '-7.9312, 116.6391', channel: 'Saringan Hulu', fleet: 'Armada Delta', crew: '6 Pasukan Kuning · Dump Truck 08',
		status: 'Sedang Pengerukan (40%)', tone: 'warn', tag: 'Timbunan Sampah Plastik Liar', actions: ['Validasi Penanganan', 'Before-After']
	},
	{
		id: '#RPT-MLG-1065', time: '06:45 WIB', ago: '1.5 jam lalu', sev: 'Sedang', severity: 62,
		estimate: 'Aliran Lambat (-45%)', loc: 'Jl. Ijen No. 12 (Boulevard Barat)', area: 'Kec. Klojen',
		gps: '-7.9719, 116.6234', channel: 'Drainase Primer', fleet: 'Antrean Dispatch', crew: 'Menunggu Armada Bravo',
		status: 'Standby Pool Sukun', tone: 'muted', tag: 'Endapan Sedimen Pasir', actions: ['Kirim Disposisi']
	},
	{
		id: '#RPT-MLG-1058', time: '06:10 WIB', ago: '2 jam lalu', sev: 'Sedang', severity: 58,
		estimate: 'Bahaya Pengendara Motor', loc: 'Jl. S. Supriadi (Depan RS Panti Waluyo)', area: 'Kec. Sukun',
		gps: '-7.9944, 116.6189', channel: 'Manhole 90cm', fleet: 'Tim Reaksi Rehab 02', crew: '3 Tukang · Pickup Precast',
		status: 'Pemasangan Grill Baru', tone: 'warn', tag: 'Tutup Bak Kontrol Ambles', actions: ['Unggah Bukti', 'Validasi Tutup']
	}
];

export const DLH_CHART = [
	{ day: 'Sen', value: 4.8 }, { day: 'Sel', value: 5.2 }, { day: 'Rab', value: 8.9, peak: true },
	{ day: 'Kam', value: 6.1 }, { day: 'Jum', value: 5.5 }, { day: 'Sab', value: 7.3 }, { day: 'Min', value: 5.0 }
];

export const DLH_HOTSPOTS = [
	{ name: 'Lowokwaru (Suhat & Tlogomas)', count: 38, pct: 45 },
	{ name: 'Klojen (Ijen & Alun-Alun)', count: 22, pct: 26 },
	{ name: 'Blimbing (Borobudur & Arjosari)', count: 14, pct: 17 },
	{ name: 'Sukun (Kepanjen Akses & Gadang)', count: 10, pct: 12 }
];

/* --------------------------------------------------------------------------
   Seller portal
   -------------------------------------------------------------------------- */
export const SELLER_ORDERS = [
	{
		id: '#ORD-MLG-7821', ago: '10 menit lalu', buyer: 'Budi Santoso', buyerSub: 'Warga RW 03 Kel. Klojen',
		channel: 'Bank Sampah Melati', items: ['2x Karung Kompos Organik 10kg', '1x Pot Anyam Sabut Kelapa (Large)'],
		payment: '1.400 Poin Warga', paymentSub: 'Subsidi DLH Terjamin', status: 'Perlu Diproses', tone: 'danger', action: 'Proses Pesanan'
	},
	{
		id: '#ORD-MLG-7820', ago: '28 menit lalu', buyer: 'Siti Rahmawati', buyerSub: 'Komunitas Hijau Oro-Oro Dowo',
		channel: 'Penjemputan Armada Mandiri', items: ['3x Paket Tong Sampah Terpilah (3 Warna)', '5x Bio-Aktivator EM4 Daur Ulang'],
		payment: 'QRIS (Rp 450.000)', paymentSub: 'Lunas Otomatis (BCA)', status: 'Siap Kirim', tone: 'info', action: 'Panggil Kurir DLH'
	},
	{
		id: '#ORD-MLG-7819', ago: '45 menit lalu', buyer: 'Koperasi Warga Sawojajar', buyerSub: 'RW 07 Sawojajar, Kedungkandang',
		channel: 'Pick-Up Counter Toko', items: ['10x Karung Kompos Organik Super 20kg'],
		payment: 'Voucher Fisik DLH #VCR-992', paymentSub: 'Verifikasi Barcode Kasir', status: 'Klaim QR Voucher', tone: 'violet', action: 'Validasi QR'
	},
	{
		id: '#ORD-MLG-7818', ago: '1 jam lalu', buyer: 'Ir. Agus Wicaksono', buyerSub: 'Pribadi / Perumahan Ijen Nirwana',
		channel: 'Pengiriman Kurir Listrik', items: ['4x Paving Block Plastik Daur Ulang (Box 12pcs)'],
		payment: 'Transfer Bank (Rp 320.000)', paymentSub: 'Verifikasi Otomatis Sukses', status: 'Perlu Diproses', tone: 'danger', action: 'Proses Pesanan'
	}
];

export const SELLER_KPI = [
	{ label: 'Pendapatan Bersih (Bln Ini)', value: 'Rp 14.850.000', trend: '+18,4% vs bulan lalu', sub: 'Termasuk kompensasi daur ulang DLH', icon: 'wallet' },
	{ label: 'Poin Warga Terkumpul', value: '12.400 Poin', trend: 'Setara Rp 620.000 klaim subsidi', sub: 'Auto-Cair tiap hari Jumat', icon: 'coins' },
	{ label: 'Menunggu Pemrosesan', value: '9 Pesanan', trend: '5 pesanan voucher, 4 reguler', sub: 'Batas SLA packing: < 2 Jam kerja', icon: 'package' },
	{ label: 'Produk Terjual & Dampak', value: '428 Unit', trend: '1,2 Ton Sampah Tereduksi', sub: 'Terverifikasi SIPSN KLHK 2025', icon: 'leaf' }
];

export const SELLER_STOCK = [
	{ name: 'Kompos Matang Super Organik (10kg)', sub: 'Hasil fermentasi cacahan daun & ampas organik Pasar Gadang', price: 'Rp 35.000', points: '700 Poin Warga', stock: 'Stok: 48 Karung', low: false, image: '/img/poin-1.webp' },
	{ name: 'Set Tempat Sampah Terpilah 3 Warna (50L)', sub: 'Plastik HDPE daur ulang, stiker pedoman pilah RT/RW', price: 'Rp 150.000', points: '3.000 Poin Warga', stock: 'Tersisa 4 Unit (Menipis)', low: true, image: '/img/poin-4.webp' },
	{ name: 'Pot Ramah Lingkungan Anyam Sabut Kelapa', sub: 'Penyerap air drainase vertikal, degradable untuk tanaman buah', price: 'Rp 18.000', points: '360 Poin Warga', stock: 'Stok: 85 Unit', low: false, image: '/img/poin-9.webp' }
];

/* --------------------------------------------------------------------------
   Profile & orders
   -------------------------------------------------------------------------- */
export const PROFILE_REPORTS = [
	{ code: '#RPT-8921', date: '24 Okt 2026 · 09:15 WIB', loc: 'Jl. Sawojajar No. 12, Klojen', type: 'Tumpukan Sampah Plastik & Sedimen', volume: 'Estimasi 15L', scale: 'Skala Tim DLH Cepat', status: 'Selesai Cleaned', tone: 'success', points: '+150 Poin', photo: '/img/report-1.webp' },
	{ code: '#RPT-8894', date: '22 Okt 2026 · 14:30 WIB', loc: 'Jl. Ijen Boulevard No. 45', type: 'Ranting Pohon & Daun Basah', volume: 'Estimasi 25L', scale: 'Skala Kerja Bakti Warga', status: 'Disposisi DLH', tone: 'info', points: '+120 Poin', photo: '/img/report-2.webp' },
	{ code: '#RPT-8850', date: '20 Okt 2026 · 07:10 WIB', loc: 'Jl. Bandung No. 8, Klojen', type: 'Endapan Lumpur & Botol Kaca', volume: 'Estimasi 10L', scale: 'Skala Triage Sedang', status: 'Validasi AI Terpadu', tone: 'warn', points: '+100 Poin', photo: '/img/report-3.webp' },
	{ code: '#RPT-8712', date: '15 Okt 2026 · 16:45 WIB', loc: 'Jl. Soekarno-Hatta RT 02', type: 'Sampah Kemasan Sachet Plastik', volume: 'Estimasi 18L', scale: 'Pembersihan Selesai', status: 'Selesai Cleaned', tone: 'success', points: '+180 Poin', photo: '/img/report-4.webp' }
];

export const PROFILE_ORDERS: Order[] = [
	{ id: '#ORD-4402', productName: 'Kompos Organik Super Matang 5kg', image: '/img/poin-1.webp', qty: '2 Karung', points: 500, cash: 20000, status: 'Dikirim', date: '24 Okt 2026 · 10:15 WIB', courier: 'Pak Rahmat Triyono · Motor Listrik N 4892 AB', eta: '15-20 Menit', address: 'Jl. Bandung No. 8, Klojen' },
	{ id: '#ORD-4397', productName: 'Pot Ramah Lingkungan Sabut Kelapa', image: '/img/poin-9.webp', qty: '1 Pcs', points: 250, cash: 0, status: 'Selesai', date: '18 Okt 2026 · 09:40 WIB', courier: 'Pasukan Kuning DLH', eta: 'Terkirim', address: 'Jl. Bandung No. 8, Klojen' },
	{ id: '#ORD-4388', productName: 'Tas Anyam Serat Daur Ulang', image: '/img/poin-3.webp', qty: '1 Pcs', points: 250, cash: 0, status: 'Selesai', date: '11 Okt 2026 · 15:20 WIB', courier: 'Kurir UMKM Sawojajar', eta: 'Terkirim', address: 'Jl. Bandung No. 8, Klojen' }
];

export const SELLER_PREVIEW = [
	{ title: 'Sumbatan Sampah Plastik - Selokan Depan Pasar', meta: 'Jl. Sawojajar Utama · 220 m · 12:42', tag: 'Disposisi', tone: 'info', action: 'Navigasi' },
	{ title: 'Kasur & Barang Bekas di Bahu Jalan', meta: 'Jl. Danau Toba No. 45 · 540 m · 11:18', tag: 'Proses Armada', tone: 'warn', action: 'Update' },
	{ title: 'Tumpukan Liar Pinggir Jalan', meta: 'Jl. Ranugrati · 80 m · 09:55', tag: 'Tertangani', tone: 'success', action: 'Lihat' },
	{ title: 'Sedimentasi Lumpur Drainase', meta: 'Jl. Madyopuro · 310 m · 08:21', tag: 'Tertangani', tone: 'success', action: 'Lihat' }
];
