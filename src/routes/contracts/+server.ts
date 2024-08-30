import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const body = await request.json();
		const { participants, contractContent } = body;

		if (!participants || !contractContent) {
			return new Response(JSON.stringify({ status: 'error', message: 'Missing data' }), {
				status: 400
			});
		}

		const currentUser = locals.pb.authStore.model;

		// Process participants
		const participantIds = [];

		for (const participant of participants) {
			let user;
			try {
				const existingUser = await locals.pb
					.collection('users')
					.getFirstListItem(`email = "${participant.email}"`);

				if (existingUser) {
					user = existingUser;
					participantIds.push(user.id);
				}
			} catch (userError) {
				// Must create user

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
					if (userError.response && userError.response.data) {
						console.error('Detailed error data:', JSON.stringify(userError.response.data, null, 2));
					}
					throw userError;
				}
			}
		}

		// Create the contract
		const contract = await locals.pb.collection('contracts').create({
			name: `Contract between ${participants.map((participant) => participant.name).join(', ')}`,
			owner: currentUser.id,
			participants: participantIds,
			content: contractContent
		});

		throw redirect(303, '/documents');
		/*
		return new redirect(JSON.stringify({ status: 'success', contract }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
		*/
	} catch (error) {
		console.error('Error creating contract:', error);
		if (error.response && error.response.data) {
			console.error('Detailed error data:', JSON.stringify(error.response.data, null, 2));
		}
		return new Response(
			JSON.stringify({
				status: 'error',
				message: 'Failed to process request',
				details: error.response?.data || error.message
			}),
			{
				status: 500
			}
		);
	}
};
