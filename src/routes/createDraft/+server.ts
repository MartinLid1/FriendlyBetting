import type { RequestHandler } from '@sveltejs/kit';

const draftPrompt = async (participants, contractDraft) => {
	const url = 'https://api.openai.com/v1/chat/completions';

	const apiKey = env.PRIVATE_OPENAI_API_KEY;

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${apiKey}`
	};

	const sParticipants = JSON.stringify(participants);

	const contractDraftPrompt = `Here is a list of participants: ${sParticipants}. They want help with writing a contract draft.
	This is what they want: ${contractDraft}. Please write a contract draft where you use the participants and only output valid markdown.
	Do not output anything else before or after the contract draft. Do not add any signature area - I will do this later.`;

	const data = {
		model: 'gpt-4o',
		messages: [
			{ role: 'system', content: 'You are a helpful legal assistant. You output valid markdown.' },
			{ role: 'user', content: contractDraftPrompt }
		]
	};

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: headers,
			body: JSON.stringify(data)
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const result = await response.json();
		return result.choices[0].message.content;
	} catch (error) {
		console.error('Error calling ChatGPT API:', error);
		throw error;
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { participants, contractDraft } = body;

		// Validate received data
		if (!participants || !contractDraft) {
			return new Response(JSON.stringify({ status: 'error', message: 'Missing data' }), {
				status: 400
			});
		}

		// Call the placeholder function with the received data
		const result = await draftPrompt(participants, contractDraft);

		// Return the success response from the placeholder function

		return new Response(JSON.stringify(result), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		// Handle possible errors in processing
		return new Response(JSON.stringify({ status: 'error', message: 'Failed to process request' }), {
			status: 500
		});
	}
};
