import { json } from '@sveltejs/kit';
import { findReport, markClean } from '#lib/server/reports-db.ts';
import { checkImage } from '#lib/server/uploads.ts';
import type { RequestHandler } from './$types';

/**
 * PATCH /api/reports/[id]/clean  (multipart/form-data: proof)
 * Once auth exists (hooks.server.ts), reject callers whose locals.user.role !== 'petugas' with 403.
 */
export const PATCH: RequestHandler = async ({ params, request }) => {
	const id = Number(params.id);
	if (!Number.isInteger(id)) return json({ message: 'ID laporan tidak valid.' }, { status: 400 });

	const report = findReport(id);
	if (!report) return json({ message: 'Laporan tidak ditemukan.' }, { status: 404 });
	if (report.done) return json({ message: 'Laporan ini sudah diselesaikan.' }, { status: 409 });

	let form: FormData;
	try {
		form = await request.formData();
	} catch {
		return json({ message: 'Format permintaan tidak valid.' }, { status: 400 });
	}
	const proofError = checkImage(form.get('proof'), 'Foto bukti bersih');
	if (proofError) return json({ message: proofError }, { status: 400 });

	return json(markClean(report));
};
