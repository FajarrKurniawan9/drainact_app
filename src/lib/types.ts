export type Role = 'warga' | 'petugas';
export type Severity = 'parah' | 'sedang';
export type HeatFilter = 'semua' | Severity | 'bersih';
export type Area = 'Klojen' | 'Blimbing' | 'Lowokwaru' | 'Sukun' | 'Kedungkandang';

/** Every page route; keeps nav links type-safe with `resolve()`. */
export type AppHref =
	| '/'
	| '/dashboard'
	| '/hub'
	| '/lapor'
	| '/poin'
	| '/tukar'
	| '/toko'
	| '/toko/tukar'
	| '/toko/pesanan'
	| '/toko/seller'
	| '/profil'
	| '/petugas'
	| '/petugas/peta'
	| '/petugas/riwayat';

export interface NavItem {
	href: AppHref;
	label: string;
}

export interface Report {
	id: number;
	area: Area;
	loc: string;
	cat: string;
	sev: Severity;
	done: boolean;
	/** True when the current browser's user filed this report. */
	mine: boolean;
	cleanedAt?: string;
	/** Optional display metadata used by the redesigned profile. */
	code?: string;
	date?: string;
	photo?: string;
	volume?: string;
	points?: number;
}

export interface ReportInput {
	area: Area;
	loc: string;
	cat: string;
	sev: Severity;
	photo: File;
}

export interface CleanResult {
	id: number;
	done: true;
	cleanedAt: string;
}

export interface Product {
	id: number;
	name: string;
	emoji?: string;
	image: string;
	/** Cost in points (Tukar Poin). */
	points: number;
	/** Cost in IDR. */
	price: number;
	description: string;
	category: string;
	seller: string;
	stock: string;
	unit: string;
}

export interface EcoProduct {
	id: number;
	name: string;
	image: string;
	price: number;
	compareAt?: number;
	discount?: number;
	rating: number;
}

export type OrderStatus = 'Diproses' | 'Dikirim' | 'Tiba' | 'Selesai';

export interface Order {
	id: string;
	productName: string;
	image: string;
	qty: string;
	points: number;
	cash: number;
	status: OrderStatus;
	date: string;
	courier: string;
	eta: string;
	address: string;
}

export interface QAItem {
	q: string;
	a: string;
}

export type MapPointSeverity = 'parah' | 'sedang' | 'kerja' | 'bersih';

export interface MapPoint {
	x: number;
	y: number;
	sev: MapPointSeverity;
	label: string;
	count: number;
}
