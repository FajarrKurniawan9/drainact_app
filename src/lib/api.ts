/**
 * Data-access layer for reports.
 *
 * `local`  (default): resolves in-browser so the demo works without a backend.
 * `remote`: talks to the SvelteKit endpoints
 *   GET   /api/reports              (fetches all reports from SQLite)
 *   POST  /api/reports              (multipart: area, loc, cat, sev, photo)
 *   PATCH /api/reports/[id]/clean   (multipart: proof)
 * Switch with VITE_API_MODE=remote.
 */
import type { CleanResult, Report, ReportInput } from './types.ts';

const REMOTE = import.meta.env.VITE_API_MODE === 'remote';

export class ApiError extends Error {
    status: number;
    constructor(message: string, status = 0) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

const wait = (ms = 250) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function request<T>(url: string, init: RequestInit): Promise<T> {
    let res: Response;
    try {
        res = await fetch(url, init);
    } catch {
        throw new ApiError('Tidak dapat terhubung ke server. Periksa koneksi internet kamu.');
    }
    if (!res.ok) {
        let message = 'Permintaan gagal. Coba lagi.';
        try {
            const body = await res.json();
            if (typeof body?.message === 'string') message = body.message;
        } catch {
            /* non-JSON error body: keep the generic message */
        }
        throw new ApiError(message, res.status);
    }
    return (await res.json()) as T;
}

export async function fetchReports(): Promise<Report[]> {
    if (REMOTE) {
        return request<Report[]>('/api/reports', { method: 'GET' });
    }
    await wait();
    return []; // In local mode, store.svelte.ts uses createSeedReports()
}

export async function submitReport(input: ReportInput): Promise<Report> {
    if (REMOTE) {
        const body = new FormData();
        body.set('area', input.area);
        body.set('loc', input.loc);
        body.set('cat', input.cat);
        body.set('sev', input.sev);
        body.set('photo', input.photo);
        return request<Report>('/api/reports', { method: 'POST', body });
    }
    await wait();
    return {
        id: Date.now(),
        area: input.area,
        loc: input.loc,
        cat: input.cat,
        sev: input.sev,
        done: false,
        mine: true
    };
}

export async function cleanReport(id: number, proof: File): Promise<CleanResult> {
    if (REMOTE) {
        const body = new FormData();
        body.set('proof', proof);
        return request<CleanResult>(`/api/reports/${id}/clean`, { method: 'PATCH', body });
    }
    await wait();
    return { id, done: true, cleanedAt: new Date().toISOString() };
}