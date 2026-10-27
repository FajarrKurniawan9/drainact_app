import { browser } from '$app/env';
import { goto } from '$app/navigation';
import { page } from '$app/state';
import * as api from './api.ts';
import {
    INITIAL_POINTS,
    POINTS_PER_REPORT,
    PRODUCTS,
    STAT_BASE,
    createSeedReports
} from './data.ts';
import type { HeatFilter, ReportInput, Report, Role } from './types.ts';

const STORAGE_KEY = 'drainact:v1';

interface Persisted {
    login: boolean;
    pts: number;
    hist: string[];
    cart: Record<number, number>;
    reports: Report[];
    added: number;
    cleaned: number;
}

class AppStore {
    // ---- persisted state ----
    login = $state(false);
    pts = $state(INITIAL_POINTS);
    hist = $state<string[]>([]);
    cart = $state<Record<number, number>>({});
    reports = $state<Report[]>(createSeedReports());
    added = $state(0);
    cleaned = $state(0);

    // ---- session-only state ----
    filter = $state<HeatFilter>('semua');
    busy = $state<number[]>([]);
    hydrated = $state(false);
    toastMessage = $state<string | null>(null);
    #toastTimer: ReturnType<typeof setTimeout> | undefined;

    // ---- derived ----
    role = $derived<Role>(page.route.id?.startsWith('/petugas') ? 'petugas' : 'warga');
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
                if (typeof d.added === 'number') this.added = d.added;
                if (typeof d.cleaned === 'number') this.cleaned = d.cleaned;
            }
        } catch {
            /* corrupt or unavailable storage */
        }
        this.hydrated = true;
        
        // Trigger SQLite sync to overwrite local reports if the backend is available
        this.syncRemoteReports();
    }

    async syncRemoteReports() {
        try {
            const remoteData = await api.fetchReports();
            if (remoteData && remoteData.length > 0) {
                this.reports = remoteData;
            }
        } catch (err) {
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
    notify(message: string, ms = 3000) {
        clearTimeout(this.#toastTimer);
        this.toastMessage = message;
        this.#toastTimer = setTimeout(() => (this.toastMessage = null), ms);
    }

    setRole(role: Role) {
        return goto(role === 'petugas' ? '/petugas' : '/');
    }

    setFilter(filter: HeatFilter) {
        this.filter = filter;
    }

    toggleLogin() {
        this.login = !this.login;
        this.notify(this.login ? 'Masuk sebagai adiesdas (demo).' : 'Kamu keluar.');
    }

    // ---- warga ----
    async submitReport(input: ReportInput): Promise<boolean> {
        try {
            const created = await api.submitReport(input);
            this.reports.unshift({ ...created, mine: true });
            this.added++;
            this.notify('Laporan terkirim ke antrean petugas.');
            return true;
        } catch (err) {
            this.notify(err instanceof api.ApiError ? err.message : 'Gagal mengirim laporan. Coba lagi.');
            return false;
        }
    }

    redeem(productId: number) {
        const p = PRODUCTS.find((x) => x.id === productId);
        if (!p) return;
        if (!this.login) return this.notify('Masuk dulu untuk menukar poin.');
        
        // Fixed the broken template literal syntax here
        if (this.pts < p.points) return this.notify(`Poin kurang ${p.points - this.pts}.`);
        
        this.pts -= p.points;
        this.hist.unshift(`-${p.points} poin: tukar ${p.name}`);
        this.notify(`Berhasil ditukar: ${p.name}`);
    }

    addToCart(productId: number) {
        this.cart[productId] = (this.cart[productId] ?? 0) + 1;
    }

    checkout() {
        this.cart = {};
        this.notify('Pesanan dibuat (simulasi).');
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