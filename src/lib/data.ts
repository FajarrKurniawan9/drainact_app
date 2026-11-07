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
	{ id: 1, name: 'Kompos Organik Super Matang', image: '/img/eco-kompos.webp', points: 150, price: 15000, description: 'Hasil olahan daun & sedimen saluran drainase Klojen.', category: 'Kompos & Pupuk Organik', seller: 'Mitra UMKM Sawojajar', stock: 'Stok Tersedia: 120 Karung', unit: '5 kg' },
	{ id: 2, name: 'Pot Sabut Kelapa Bio-degradable', image: '/img/eco-pot.webp', points: 250, price: 15000, description: 'Pot ramah lingkungan diameter 18cm untuk tanaman hias.', category: 'Paving & Kerajinan Suroja', seller: 'Koperasi Lingkungan Buring', stock: 'Stok Tersedia: 38 Pcs', unit: '1 pcs' },
	{ id: 3, name: 'Tas Anyaman Kemasan Kopi', image: '/img/eco-tas.webp', points: 300, price: 25000, description: 'Totebag kuat & modis dari 120 bungkus kopi daur ulang.', category: 'Paving & Kerajinan Suroja', seller: 'Paguyuban Ibu Sukun', stock: 'Stok Tersedia: 24 Pcs', unit: '1 pcs' },
	{ id: 4, name: 'Paving Block Plastik Daur Ulang', image: '/img/eco-paving.webp', points: 100, price: 10000, description: 'Tahan beban K-250, dibuat dari 3kg cacahan kresek.', category: 'Paving & Kerajinan Suroja', seller: 'TPST 3R Supit Urang', stock: 'Stok Tersedia: 500 Pcs', unit: '1 pcs' },
	{ id: 5, name: 'Pupuk Cair POC Sayur 1L', image: '/img/eco-pupuk.webp', points: 200, price: 18000, description: 'Fermentasi EM4 mikroorganisme penyubur tanah pekarangan.', category: 'Kompos & Pupuk Organik', seller: 'Kelompok Tani Sawojajar', stock: 'Stok Tersedia: 64 Botol', unit: '1 L' },
	{ id: 6, name: 'Voucher Sembako Rp 25.000', image: '/img/eco-voucher.webp', points: 400, price: 25000, description: 'Bisa dibelanjakan di 25 e-warung & toko kelontong mitra.', category: 'Voucher Digital', seller: 'Koperasi Malang Bersatu', stock: 'Kuota: 40 Voucher', unit: '1 voucher' },
	{ id: 7, name: 'Bibit Tabebuya & Trembesi', image: '/img/eco-bibit.webp', points: 100, price: 0, description: 'Program penghijauan sempadan sungai & lorong drainase.', category: 'Pertanian Kota', seller: 'Dinas Lingkungan Hidup', stock: 'Subsidi Penuh', unit: '1 bibit' },
	{ id: 8, name: 'Sabun Batang Jelantah Alami', image: '/img/eco-sabun.webp', points: 120, price: 12000, description: 'Aroma serai & kopi, ramah air tanah & bebas limbah.', category: 'Kompos & Pupuk Organik', seller: 'Bank Sampah Melati', stock: 'Stok Tersedia: 150 Pcs', unit: '1 pcs' }
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
