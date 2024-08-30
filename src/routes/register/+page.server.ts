import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return { providers: await locals.pb?.collection('users').listAuthMethods() };
};

export const actions: Actions = {
	register: async ({ locals, request }) => {
		const data = Object.fromEntries(await request.formData()) as {
			email: string;
			name: string;
			password: string;
			passwordConfirm: string;
			emailVisibility: boolean;
		};

		data.emailVisibility = true;

		try {
			await locals.pb.collection('users').create(data);
			await locals.pb.collection('users').requestVerification(data.email);
			await locals.pb.collection('users').authWithPassword(data.email, data.password);
		} catch (e) {
			console.error(e);
			throw e;
		}

		throw redirect(303, '/app');
	}
};
