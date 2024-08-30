import { createInstance } from '$lib/pocketbase';
import { handleLoginRedirect } from '$lib/utils';
import { redirect, type Handle } from '@sveltejs/kit';

const PROTECTED_URLS = ['/dashboard'];

export const handle: Handle = async ({ event, resolve }) => {
	const pb = createInstance();

	// load the store data from the request cookie string
	pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
	try {
		// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
		if (pb.authStore.isValid) {
			await pb.collection('users').authRefresh();
		}
	} catch (_) {
		// clear the auth store on failed refresh
		pb.authStore.clear();
	}

	event.locals.pb = pb;
	event.locals.user = pb.authStore.model;

	if (event.url.pathname === '/') {
		if (!event.locals.user) {
			throw redirect(303, '/login');
		} else {
			throw redirect(303, '/dashboard');
		}
	}

	for (const url of PROTECTED_URLS) {
		if (event.url.pathname.startsWith(url) && !event.locals.user) {
			throw redirect(303, handleLoginRedirect(event, 'You must be logged in to see this page'));
		}
	}

	const response = await resolve(event);

	// send back the default 'pb_auth' cookie to the client with the latest store state
	response.headers.set('set-cookie', pb.authStore.exportToCookie({ httpOnly: false }));

	return response;
};
