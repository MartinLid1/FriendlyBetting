import type { RequestHandler } from '@sveltejs/kit';
import { getDocument } from '$lib/scrive/scriveApi';
import { json } from '@sveltejs/kit';

function findSignatoryStatus(doc: any): { signed: string[]; notSigned: string[] } {
	const signed: string[] = [];
	const notSigned: string[] = [];

	doc.parties.forEach((party: any) => {
		const nameField = party.fields.find((field: any) => field.type === 'name');
		const signatoryName = nameField ? nameField.value : 'Unknown';

		if (party.sign_time) {
			signed.push(signatoryName);
		} else {
			notSigned.push(signatoryName);
		}
	});

	return { signed, notSigned };
}

export const GET: RequestHandler = async ({ params, locals }) => {
	const { documentId } = params;

	const doc = await getDocument(documentId);
	console.log(doc);
	const { signed, notSigned } = findSignatoryStatus(doc);
	console.log(signed, notSigned);

	if (notSigned.length === 0) {
		const c = await locals.pb
			.collection('contracts')
			.getFirstListItem(`scriveDocumentId = "${documentId}"`);

		await locals.pb.collection('contracts').update(c.id, {
			scriveStatus: true
		});

		return json({
			status: 'signed'
		});
	}
	return json({
		status: 'unsigned'
	});
};
