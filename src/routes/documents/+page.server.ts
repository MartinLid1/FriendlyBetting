import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
	try {
		const docs = await locals.pb.collection('contracts').getList(1, 30, {
			sort: '-created',
			expand: 'participants'
		});
		return { docs };
	} catch (e) {
		console.log(e);
		return null;
	}
};
