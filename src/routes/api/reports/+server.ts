import { json } from '@sveltejs/kit';
import { isArea, isCategory, isSeverity } from '#lib/data.ts';
import { createReport, getAllReports } from '#lib/server/reports-db.ts';
import { checkImage } from '#lib/server/uploads.ts';
import type { RequestHandler } from './$types';

/** GET /api/reports (Fetch all reports for cross-device sync) */
export const GET: RequestHandler = async () => {
    try {
        const reports = getAllReports();
        return json(reports);
    } catch (error) {
        return json({ message: 'Gagal mengambil data dari database.' }, { status: 500 });
    }
};

/** POST /api/reports  (multipart/form-data: area, loc, cat, sev, photo) */
export const POST: RequestHandler = async ({ request }) => {
    let form: FormData;
    try {
        form = await request.formData();
    } catch {
        return json({ message: 'Format permintaan tidak valid.' }, { status: 400 });
    }

    const area = form.get('area');
    const cat = form.get('cat');
    const sev = form.get('sev');
    const loc = String(form.get('loc') ?? '').trim();

    if (!isArea(area)) return json({ message: 'Kecamatan tidak valid.' }, { status: 400 });
    if (!isCategory(cat)) return json({ message: 'Jenis masalah tidak valid.' }, { status: 400 });
    if (!isSeverity(sev)) return json({ message: 'Tingkat gangguan tidak valid.' }, { status: 400 });
    if (loc.length < 3 || loc.length > 200) {
        return json({ message: 'Lokasi detail harus 3 sampai 200 karakter.' }, { status: 400 });
    }
    
    const photoError = checkImage(form.get('photo'), 'Foto bukti');
    if (photoError) return json({ message: photoError }, { status: 400 });

    // The record is created in SQLite. Physical file storage can be added here later if needed.
    const newReport = createReport({ area, loc, cat, sev });
    return json(newReport, { status: 201 });
};