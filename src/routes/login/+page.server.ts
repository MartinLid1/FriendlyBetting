import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { logger } from '$lib/utils';

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1)
});

export const load = async () => {
	const form = await superValidate(zod(loginSchema));
	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event.request, zod(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await event.locals.pb
				.collection('users')
				.authWithPassword(form.data.email, form.data.password);
		} catch (e) {
			logger.error(e);
			return message(form, 'Invalid login. Please try again.', {
				status: 400
			});
		}

		let redirectTo = event.url.searchParams.get('redirectTo');
		if (redirectTo) {
			if (!redirectTo.startsWith('/')) {
				console.log('Modifying url..');
				redirectTo = `/${redirectTo}`;
			}
			throw redirect(302, redirectTo);
		}
		throw redirect(302, '/app');
	}
};
