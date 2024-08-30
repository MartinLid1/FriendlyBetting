import type { RequestEvent } from '@sveltejs/kit';

export const handleLoginRedirect = (event: RequestEvent, message: string) => {
	let redirectTo = event.url.pathname + event.url.search;
	return `/login?redirectTo=${redirectTo}&message=${message}`;
};

export const isProduction = () => process.env.NODE_ENV === 'production';

export const isMobile = () => window.innerWidth < 640;
