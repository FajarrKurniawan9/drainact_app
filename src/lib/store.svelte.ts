import { browser } from '$app/env';
import * as api from './api.ts';
import { PROFILE_ORDERS } from './content.ts';
import { INITIAL_POINTS, POINTS_PER_REPORT, PRODUCTS, STAT_BASE, createSeedReports } from './data.ts';
import type { HeatFilter, Order, ReportInput, Report, Role } from './types.ts';

const STORAGE_KEY = 'drainact:v2';

interface Persisted {
	login: boolean;
	pts: number;
	hist: string[];
	cart: Record<number, number>;
	reports: Report[];
	orders: Order[];
	added: number;
	cleaned: number;
}

class AppStore {
	// ---- persisted state ----
	login = $state(true);
	pts = $state(INITIAL_POINTS);
	hist = $state<string[]>([]);
	cart = $state<Record<number, number>>({});
	reports = $state<Report[]>(createSeedReports());
	orders = $state<Order[]>(PROFILE_ORDERS.map((o) => ({ ...o })));
	added = $state(0);
	cleaned = $state(0);

	// ---- session-only state ----
	role = $state<Role>('warga');
	filter = $state<HeatFilter>('semua');
	busy = $state<number[]>([]);
	hydrated = $state(false);
	toastMessage = $state<string | null>(null);
	reportOpen = $state(false);
	selectedOrder = $state<Order | null>(null);
	#toastTimer: ReturnType<typeof setTimeout> | undefined;

	// ---- derived ----
	queue = $derived(
		this.reports.filter((r) => !r.done).sort((a, b) => Number(a.sev !== 'parah') - Number(b.sev !== 'parah'))
	);
	doneReports = $derived(this.reports.filter((r) => r.done));
	myReports = $derived(this.reports.filter((r) => r.mine));
	cartCount = $derived(Object.values(this.cart).reduce((sum, qty) => sum + qty, 0));
	cartTotal = $derived(
		Object.entries(this.cart).reduce(
			(sum, [id, qty]) => sum + (PRODUCTS.find((p) => p.id === Number(id))?.price ?? 0) * qty,
			0
		)
	);
	balanceLabel = $derived(this.login ? `${this.pts} poin` : 'Masuk dulu');
	stats = $derived({
		received: STAT_BASE.received + this.added,
		cleaned: STAT_BASE.cleaned + this.cleaned,
		tons: STAT_BASE.tons
	});

	constructor() {
		this.hydrate();
	}

	// ---- persistence ----
	hydrate() {
		if (!browser || this.hydrated) return;
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const d = JSON.parse(raw) as Partial<Persisted>;
				if (typeof d.login === 'boolean') this.login = d.login;
				if (typeof d.pts === 'number') this.pts = d.pts;
				if (Array.isArray(d.hist)) this.hist = d.hist;
				if (d.cart && typeof d.cart === 'object') this.cart = d.cart;
				if (Array.isArray(d.reports)) this.reports = d.reports;
				if (Array.isArray(d.orders)) this.orders = d.orders;
				if (typeof d.added === 'number') this.added = d.added;
				if (typeof d.cleaned === 'number') this.cleaned = d.cleaned;
			}
		} catch {
			/* corrupt or unavailable storage */
		}
		this.hydrated = true;
		this.syncRemoteReports();
	}

	async syncRemoteReports() {
		try {
			const remoteData = await api.fetchReports();
			if (remoteData && remoteData.length > 0) this.reports = remoteData;
		} catch {
			console.warn('Running offline/local mode. Could not sync with server.');
		}
	}

	save() {
		if (!browser || !this.hydrated) return;
		const data: Persisted = $state.snapshot({
			login: this.login,
			pts: this.pts,
			hist: this.hist,
			cart: this.cart,
			reports: this.reports,
			orders: this.orders,
			added: this.added,
			cleaned: this.cleaned
		});
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		} catch {
			/* quota exceeded or private mode */
		}
	}

	// ---- ui ----
	notify(message: string, ms = 3200) {
		clearTimeout(this.#toastTimer);
		this.toastMessage = message;
		this.#toastTimer = setTimeout(() => (this.toastMessage = null), ms);
	}

	openReport() {
		this.reportOpen = true;
	}

	closeReport() {
		this.reportOpen = false;
	}

	openTracking(order: Order) {
		this.selectedOrder = order;
	}

	closeTracking() {
		this.selectedOrder = null;
	}

	setFilter(filter: HeatFilter) {
		this.filter = filter;
	}

	toggleLogin() {
		this.login = !this.login;
		if (this.login) this.pts = Math.max(this.pts, INITIAL_POINTS);
		this.notify(
			this.login
				? 'Masuk sebagai Budi Santoso. Poin dan riwayat tersinkron.'
				: 'Kamu keluar. Laporan tamu tetap bisa dikirim.'
		);
	}

	// ---- warga ----
	async submitReport(input: ReportInput): Promise<boolean> {
		try {
			const created = await api.submitReport(input);
			this.reports.unshift({ ...created, mine: true });
			this.added++;
			this.notify('Laporan terkirim ke antrean petugas DLH.');
			return true;
		} catch (err) {
			this.notify(err instanceof api.ApiError ? err.message : 'Gagal mengirim laporan. Coba lagi.');
			return false;
		}
	}

	redeem(productId: number): boolean {
		const p = PRODUCTS.find((x) => x.id === productId);
		if (!p) return false;
		if (!this.login) this.login = true;
		if (this.pts < p.points) {
			this.notify(`Poin kurang ${p.points - this.pts}.`);
			return false;
		}
		this.pts -= p.points;
		this.hist.unshift(`-${p.points} poin: tukar ${p.name}`);
		this.orders.unshift({
			id: `#ORD-${Math.floor(4000 + Math.random() * 900)}`,
			productName: p.name,
			image: p.image,
			qty: `1 ${p.unit}`,
			points: p.points,
			cash: 0,
			status: 'Diproses',
			date: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB',
			courier: 'Kurir Hijau Pasukan Kuning',
			eta: '20-30 Menit',
			address: 'Jl. Bandung No. 8, Klojen'
		});
		this.notify(`Berhasil ditukar: ${p.name}`);
		return true;
	}

	addToCart(productId: number) {
		this.cart[productId] = (this.cart[productId] ?? 0) + 1;
	}

	checkout() {
		const first = Object.entries(this.cart)[0];
		if (first) {
			const p = PRODUCTS.find((x) => x.id === Number(first[0]));
			if (p) {
				this.orders.unshift({
					id: `#ORD-${Math.floor(4000 + Math.random() * 900)}`,
					productName: p.name,
					image: p.image,
					qty: `${first[1]} ${p.unit}`,
					points: p.points * Number(first[1]),
					cash: 0,
					status: 'Diproses',
					date: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB',
					courier: 'Kurir Hijau Pasukan Kuning',
					eta: '20-30 Menit',
					address: 'Jl. Bandung No. 8, Klojen'
				});
			}
		}
		this.cart = {};
		this.notify('Pesanan dibuat. Kurir UMKM segera menjemput.');
	}

	// ---- petugas ----
	isBusy(id: number) {
		return this.busy.includes(id);
	}

	async cleanReport(id: number, proof: File): Promise<void> {
		const report = this.reports.find((r) => r.id === id);
		if (!report || report.done || this.isBusy(id)) return;
		this.busy.push(id);
		try {
			const result = await api.cleanReport(id, proof);
			report.done = result.done;
			report.cleanedAt = result.cleanedAt;
			this.cleaned++;
			if (report.mine && this.login) {
				this.pts += POINTS_PER_REPORT;
				this.hist.unshift(`+${POINTS_PER_REPORT} poin: "${report.loc}" sudah diangkut`);
			}
			this.notify(
				report.mine
					? this.login
						? `Selesai. Pelapor mendapat ${POINTS_PER_REPORT} poin.`
						: 'Selesai. Pelapor tamu tidak mendapat poin.'
					: 'Selesai. Foto bukti tersimpan.'
			);
		} catch (err) {
			this.notify(err instanceof api.ApiError ? err.message : 'Gagal menyelesaikan tugas. Coba lagi.');
		} finally {
			this.busy = this.busy.filter((x) => x !== id);
		}
	}
}

export const store = new AppStore();
