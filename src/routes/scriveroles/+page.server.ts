// src/routes/+page.server.ts
import { getUserRoles } from '$lib/ScriveApi';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const data = await getUserRoles(); // Use the API wrapper function
		return {
			data
		};
	} catch (error) {
		return {
			error: error.message
		};
	}
};