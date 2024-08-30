import { createDocAndStartSigningProcess } from '$lib/scrive/scriveApi';
import type { Actions } from './$types';

export const actions: Actions = {
	initiateSigning: async ({ request }) => {
		const data = await request.formData();
		const documentId = data.get('documentId') as string;
		const signatorie = data.get('signatories') as string;

		try {
			const result = await createDocAndStartSigningProcess(documentId, [signatorie]);
			return { success: true, result };
		} catch (error) {
			return { success: false, error: error.message };
		}
	}
};