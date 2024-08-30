// @ts-nocheck
import type { PageServerLoad } from './$types';

export const load = async ({ locals, params }: Parameters<PageServerLoad>[0]) => {
	try {
		const docs = await locals.pb.collection('documents').getList(1, 30, {
			sort: '-created'
		});
		console.log(docs);
		return { docs };
	} catch (e) {
		console.log(e);
		return null;
	}
};
