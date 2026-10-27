export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Returns an error message, or null when the form entry is an acceptable image upload. */
export function checkImage(entry: FormDataEntryValue | null, label: string): string | null {
	if (!(entry instanceof File) || entry.size === 0) return `${label} wajib dilampirkan.`;
	if (!entry.type.startsWith('image/')) return `${label} harus berupa gambar.`;
	if (entry.size > MAX_IMAGE_BYTES) return `${label} maksimal 5 MB.`;
	return null;
}
