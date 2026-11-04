import type {
	Area,
	HeatFilter,
	NavItem,
	Product,
	QAItem,
	Report,
	Role,
	Severity
} from './types.ts';

/** Heatmap anchor of each kecamatan, in % of the map box: [left, top]. */
export const AREAS: Record<Area, readonly [number, number]> = {
	Klojen: [50, 48],
	Blimbing: [70, 28],
	Lowokwaru: [32, 26],
	Sukun: [30, 70],
	Kedungkandang: [72, 70]
};
export const AREA_NAMES = Object.keys(AREAS) as Area[];

export const CATEGORIES = [
	'Sumbatan Drainase & Banjir',
	'Tumpukan Sampah Liar',
	'Genangan Air & Sedimen',
	'Sedimen Lumpur Tebal',
	'Sampah Bulky / Perabot',
	'Lainnya'
] as const;

export const SEVERITIES: { value: Severity; label: string }[] = [
	{ value: 'parah', label: 'Parah: bau parah atau jalan terhalang' },
	{ value: 'sedang', label: 'Sedang: menumpuk tapi belum menghalangi' }
];

export const HEAT_FILTERS: HeatFilter[] = ['semua', 'parah', 'sedang', 'bersih'];

export const NAV: Record<Role, NavItem[]> = {
	warga: [
		{ href: '/', label: 'Beranda' },
		{ href: '/lapor', label: 'Lapor' },
		{ href: '/poin', label: 'Poin' },
		{ href: '/tukar', label: 'Tukar' },
		{ href: '/toko', label: 'Toko' },
		{ href: '/profil', label: 'Profil' },
		{ href: '/toko/seller', label: 'Seller' }
	],
	petugas: [
		{ href: '/petugas', label: 'Antrean Tugas' },
		{ href: '/petugas/peta', label: 'Peta Tugas' },
		{ href: '/petugas/riwayat', label: 'Riwayat Selesai' }
	]
};

export const PRODUCTS: Product[] = [
	{ id: 1, name: 'Kompos Organik Super Matang', image: '/img/poin-1.webp', points: 150, price: 15000, description: 'Pupuk olahan daun & sampah dapur kawasan Malang.', category: 'Kompos & Pupuk Organik', seller: 'Mitra UMKM Sawojajar', stock: 'Stok Tersedia: 120 Karung', unit: '5 kg' },
	{ id: 2, name: 'Pupuk Cair Organik EM4', image: '/img/poin-2.webp', points: 120, price: 12000, description: 'Fermentasi sampah dapur untuk tanaman rumah.', category: 'Kompos & Pupuk Organik', seller: 'Kelompok Tani Sawojajar', stock: 'Stok Tersedia: 64 Botol', unit: '1 L' },
	{ id: 3, name: 'Tas Anyam Serat Daur Ulang', image: '/img/poin-3.webp', points: 250, price: 25000, description: 'Anyaman tangan pengrajin binaan DLH Kota Malang.', category: 'Paving & Kerajinan Suroja', seller: 'Kriya Suroja', stock: 'Stok Tersedia: 38 Pcs', unit: '1 pcs' },
	{ id: 4, name: 'Paket Tanaman Herbal Rumah', image: '/img/poin-4.webp', points: 300, price: 30000, description: 'Tiga pot herbal siap panen untuk dapur warga.', category: 'Pertanian Kota', seller: 'Kebun Warga Klojen', stock: 'Stok Tersedia: 22 Paket', unit: '3 pot' },
	{ id: 5, name: 'Bibit Tanaman Buah Lokal', image: '/img/poin-5.webp', points: 200, price: 20000, description: 'Bibit unggul hasil pembibitan bank sampah.', category: 'Pertanian Kota', seller: 'Bank Sampah Melati', stock: 'Stok Tersedia: 80 Bibit', unit: '1 bibit' },
	{ id: 6, name: 'Voucher Digital Merchant Rp50.000', image: '/img/poin-6.webp', points: 500, price: 50000, description: 'Voucher belanja mitra UMKM sirkular Malang.', category: 'Voucher Digital', seller: 'DrainAct Partner', stock: 'Kuota: 40 Voucher', unit: '1 voucher' },
	{ id: 7, name: 'Paket Wisata Edukasi Sungai', image: '/img/poin-7.webp', points: 400, price: 40000, description: 'Tur edukasi pengelolaan sampah dan DAS Brantas.', category: 'Edukasi Lingkungan', seller: 'Komunitas Brantas', stock: 'Kuota: 18 Kursi', unit: '1 orang' },
	{ id: 8, name: 'Kompos Kemasan Kraft 2kg', image: '/img/poin-8.webp', points: 90, price: 9000, description: 'Kemasan ramah lingkungan untuk kebun kecil.', category: 'Kompos & Pupuk Organik', seller: 'Mitra UMKM Sawojajar', stock: 'Stok Tersedia: 150 Pack', unit: '2 kg' },
	{ id: 9, name: 'Pot Sabut Kelapa + Kompos', image: '/img/poin-9.webp', points: 180, price: 18000, description: 'Pot biodegradable siap tanam, hasil daur ulang.', category: 'Paving & Kerajinan Suroja', seller: 'Kriya Suroja', stock: 'Stok Tersedia: 55 Set', unit: '1 set' }
];

export const QA: QAItem[] = [
	{ q: 'Bagaimana cara lapor?', a: 'Lampirkan foto, pilih kecamatan, tulis lokasi, lalu kirim. Tamu juga boleh lapor.' },
	{ q: 'Kapan saya dapat poin?', a: 'Setelah petugas mengangkut dan mengunggah foto bersih. Hanya akun yang sudah masuk yang dapat poin.' },
	{ q: 'Siapa yang mengangkut?', a: 'Petugas kebersihan mitra. Mereka punya tampilan sendiri di mode Petugas DLH.' },
	{ q: 'Poin bisa ditukar apa?', a: 'Kompos, pupuk cair, pot daur ulang, tas anyaman plastik. Buka menu Tukar Poin.' }
];

export const INITIAL_POINTS = 1250;
export const POINTS_PER_REPORT = 50;
/** Platform-wide figures shown on Beranda; live counters are added on top. */
export const STAT_BASE = { received: 12408, cleaned: 847, tons: '42,8 ton' } as const;

/** Fresh copy each call so callers can mutate without affecting the seed. */
export function createSeedReports(): Report[] {
	const r = (
		id: number,
		area: Area,
		loc: string,
		cat: string,
		sev: Severity,
		done = false
	): Report => ({ id, area, loc, cat, sev, done, mine: false });
	return [
		r(1, 'Kedungkandang', 'Lahan kosong dekat Sawojajar Gang 5', CATEGORIES[0], 'parah'),
		r(2, 'Lowokwaru', 'Pinggir Jl. Soekarno-Hatta', CATEGORIES[1], 'sedang'),
		r(3, 'Klojen', 'Pojok pasar dekat Jl. Kawi', CATEGORIES[2], 'parah'),
		r(4, 'Blimbing', 'TPS perumahan Araya', CATEGORIES[3], 'sedang'),
		r(5, 'Sukun', 'Tepi sungai Jl. Bandulan', CATEGORIES[0], 'parah'),
		r(6, 'Klojen', 'Lahan kosong Jl. Semeru', CATEGORIES[0], 'parah', true),
		r(7, 'Blimbing', 'Pinggir Jl. Borobudur', CATEGORIES[1], 'sedang', true)
	];
}

export const isArea = (v: unknown): v is Area => typeof v === 'string' && v in AREAS;
export const isSeverity = (v: unknown): v is Severity => v === 'parah' || v === 'sedang';
export const isCategory = (v: unknown): v is string =>
	typeof v === 'string' && (CATEGORIES as readonly string[]).includes(v);
