export type Role = 'warga' | 'petugas';
export type Severity = 'parah' | 'sedang';
export type HeatFilter = 'semua' | Severity | 'bersih';
export type Area = 'Klojen' | 'Blimbing' | 'Lowokwaru' | 'Sukun' | 'Kedungkandang';

/** Every page route; keeps nav links type-safe with `resolve()`. */
export type AppHref =
	| '/'
	| '/lapor'
	| '/poin'
	| '/tukar'
	| '/toko'
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
	emoji: string;
	/** Cost in points (Tukar Poin). */
	points: number;
	/** Cost in IDR (Toko). */
	price: number;
	description: string;
}

export interface QAItem {
	q: string;
	a: string;
}
