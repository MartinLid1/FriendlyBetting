import { getDocumentList } from '$lib/ScriveApi';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const data = await getDocumentList();
		return {
			data
		};
	} catch (error) {
		return {
			error: error.message
		};
	}
};