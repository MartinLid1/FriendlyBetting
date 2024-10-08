import type { RequestHandler } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { createDocAndStartSigningProcess } from '$lib/scrive/scriveApi';

export const POST: RequestHandler = async ({ request, locals }) => {
	const body = await request.json();
	const { participants, contractContent } = body;

	if (!participants || !contractContent) {
		return new Response(JSON.stringify({ status: 'error', message: 'Missing data' }), {
			status: 400
		});
	}

	const currentUser = locals.pb.authStore.model;
	const participantIds = [];
	const participantEmails = [];

	for (const participant of participants) {
		let user;
		try {
			const existingUser = await locals.pb
				.collection('users')
				.getFirstListItem(`email = "${participant.email}"`);

			if (existingUser) {
				user = existingUser;
				participantIds.push(user.id);
				participantEmails.push(user.email);
			}
		} catch (userError) {
			console.log(userError);
			const junkPw = 'qwerty123';
			const settings = {
				email: participant.email,
				name: participant.name,
				emailVisibility: true,
				password: junkPw,
				passwordConfirm: junkPw
			};
			try {
				user = await locals.pb.collection('users').create(settings);
				console.log('New user created:', user.id);
				participantIds.push(user.id);
				participantEmails.push(user.email);
			} catch (error) {
				console.log(error);
			}
		}
	}
	// Create the contract
	let r;
	try {
		r = await createDocAndStartSigningProcess(contractContent, participantEmails);
	} catch (error) {
		console.log(error);
	}

	console.log(r);

	try {
		const contract = await locals.pb.collection('contracts').create({
			name: `Contract (title) between ${participants.map((participant) => participant.name).join(', ')}`,
			owner: currentUser.id,
			participants: participantIds,
			content: contractContent,
			scriveDocumentId: r.startResult.id,
			scriveStatus: false
		});
	} catch (e) {
		console.log(e);
	}
	return new Response({ status: 200 });
};
