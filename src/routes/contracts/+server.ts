import type { RequestHandler } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	console.log('AAA');
	const body = await request.json();
	const { participants, contractContent } = body;

	if (!participants || !contractContent) {
		return new Response(JSON.stringify({ status: 'error', message: 'Missing data' }), {
			status: 400
		});
	}

	console.log('BBB');

	const currentUser = locals.pb.authStore.model;
	const participantIds = [];

	for (const participant of participants) {
		let user;
		try {
			console.log('CCC');
			const existingUser = await locals.pb
				.collection('users')
				.getFirstListItem(`email = "${participant.email}"`);

			if (existingUser) {
				user = existingUser;
				participantIds.push(user.id);
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
			} catch (error) {
				console.log(error);
			}
		}
	}
	// Create the contract
	try {
		const contract = await locals.pb.collection('contracts').create({
			name: `Contract between ${participants.map((participant) => participant.name).join(', ')}`,
			owner: currentUser.id,
			participants: participantIds,
			content: contractContent
		});
	} catch (error) {
		console.log(error);
	}

	return new Response({ status: 200 });
};
