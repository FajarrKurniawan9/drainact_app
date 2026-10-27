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
	'Tumpukan sampah liar di pinggir jalan',
	'Sampah menghalangi jalan',
	'Bau menyengat dekat permukiman',
	'TPS penuh dan meluber',
	'Sampah menyumbat saluran air'
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
		{ href: '/poin', label: 'Poin Saya' },
		{ href: '/tukar', label: 'Tukar Poin' },
		{ href: '/toko', label: 'Toko' }
	],
	petugas: [
		{ href: '/petugas', label: 'Antrean Tugas' },
		{ href: '/petugas/peta', label: 'Peta Tugas' },
		{ href: '/petugas/riwayat', label: 'Riwayat Selesai' }
	]
};

export const PRODUCTS: Product[] = [
	{ id: 1, name: 'Pupuk kompos organik 5 kg', emoji: '🌱', points: 150, price: 35000, description: 'Dari sisa makanan terpilah' },
	{ id: 2, name: 'Pot tanaman daur ulang', emoji: '🪴', points: 200, price: 25000, description: 'Botol plastik terpilah' },
	{ id: 3, name: 'Tas anyaman plastik', emoji: '👜', points: 250, price: 45000, description: 'Karya pengrajin lokal' },
	{ id: 4, name: 'Pupuk cair organik 1 L', emoji: '🧴', points: 120, price: 20000, description: 'Fermentasi sampah dapur' }
];

export const QA: QAItem[] = [
	{ q: 'Bagaimana cara lapor?', a: 'Lampirkan foto, pilih kecamatan, tulis lokasi, lalu kirim. Tamu juga boleh lapor.' },
	{ q: 'Kapan saya dapat poin?', a: 'Setelah petugas mengangkut dan mengunggah foto bersih. Hanya akun yang sudah masuk yang dapat poin.' },
	{ q: 'Siapa yang mengangkut?', a: 'Petugas kebersihan mitra. Mereka punya tampilan sendiri di mode Petugas DLH.' },
	{ q: 'Poin bisa ditukar apa?', a: 'Kompos, pupuk cair, pot daur ulang, tas anyaman plastik. Buka menu Tukar Poin.' }
];

export const INITIAL_POINTS = 450;
export const POINTS_PER_REPORT = 50;
/** Platform-wide figures shown on Beranda; live counters are added on top. */
export const STAT_BASE = { received: 12408, cleaned: 847, tons: '14,8 ton' } as const;

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
