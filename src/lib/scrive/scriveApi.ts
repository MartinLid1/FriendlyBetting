import { env } from '$env/dynamic/private';
import fetch from 'node-fetch';
import PDFDocument from 'pdfkit';
import FormData from 'form-data';
import { v4 as uuidv4 } from 'uuid';

const API_BASE_URL = env.SCRIVE_API_BASE_URL;
const OAUTH_CONSUMER_KEY = env.SCRIVE_OAUTH_CONSUMER_KEY;
const OAUTH_CONSUMER_SECRET = env.SCRIVE_OAUTH_CONSUMER_SECRET;
const OAUTH_TOKEN = env.SCRIVE_OAUTH_TOKEN;
const OAUTH_TOKEN_SECRET = env.SCRIVE_OAUTH_TOKEN_SECRET;

function getAuthorizationHeader() {
	const oauthSignature = `${OAUTH_CONSUMER_SECRET}&${OAUTH_TOKEN_SECRET}`;
	return `OAuth oauth_signature_method="PLAINTEXT",oauth_consumer_key="${OAUTH_CONSUMER_KEY}",oauth_token="${OAUTH_TOKEN}",oauth_signature="${oauthSignature}"`;
}

async function fetchFromApi(endpoint: string, method: string = 'GET', body?: any, contentType: string = 'application/json'): Promise<any> {
	const url = `${API_BASE_URL}${endpoint}`;
	const headers: any = {
		'Authorization': getAuthorizationHeader()
	};

	const options: any = {
		method: method,
		headers: headers
	};

	if (body) {
		if (contentType === 'application/json') {
			headers['Content-Type'] = 'application/json';
			options.body = JSON.stringify(body);
		} else if (contentType === 'multipart/form-data') {
			options.body = body;
		}
	}

	try {
		const response = await fetch(url, options);
		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
		}
		return await response.json();
	} catch (error) {
		console.error('Failed to fetch data:', error);
		throw error;
	}
}

async function postToApi(endpoint: string, params: {
	[key: string]: any
}): Promise<any> {
	let url = `${API_BASE_URL}${endpoint}`;
	const headers: any = {
		'Authorization': getAuthorizationHeader()
	};

	const options: any = {
		method: 'POST',
		headers: headers
	};

	for (const key in params) {
		if (params.hasOwnProperty(key)) {
			url += '?' + key + '=' + JSON.stringify(params[key]);
		}
	}

	try {
		const response = await fetch(url, options);
		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
		}
		return await response.json();
	} catch (error) {
		console.error('Failed to post data:', error);
		throw error;
	}
}

export async function createNewDocument(documentContents: string, saved: boolean = true): Promise<{ id, parties }> {
	const formData = new FormData();
	const pdf: Buffer = await createPDFfromString(documentContents);

	formData.append('file', pdf, {
		filename: uuidv4() + '.pdf',
		contentType: 'application/pdf'
	});

	formData.append('saved', saved.toString());

	return fetchFromApi('/documents/new', 'POST', formData, 'multipart/form-data');
}

export async function updateDocument(documentId: string, updates: any): Promise<any> {
	console.log(updates);
	return postToApi(`/documents/${documentId}/update`, updates);
}

export async function startSigning(documentId: string): Promise<any> {
	return fetchFromApi(`/documents/${documentId}/start`, 'POST');
}


export async function createDocAndStartSigningProcess(documentContents: string, signatorieEmails: string[]): Promise<any> {
	const document = await createNewDocument(documentContents);
	const documentId = document.id;
	document.parties = (document.parties || []) as Signatory[];
	document.parties = document.parties.concat(createSignatoriesFromEmails(signatorieEmails));
	await updateDocument(documentId, { document });

	const startResult = await startSigning(documentId);

	return { startResult };
}

function createSignatoriesFromEmails(emails: string[]): Signatory[] {
	return emails.map((email, index) => {
		const name = email.split('@')[0];

		return {
			is_signatory: true,
			signatory_role: 'signing_party',
			fields: [
				{
					type: 'name',
					order: 1,
					value: name,
					is_obligatory: true,
					should_be_filled_by_sender: true,
					editable_by_signatory: false,
					placements: [],
					description: null
				},
				{
					type: 'email',
					value: email,
					is_obligatory: true,
					should_be_filled_by_sender: true,
					editable_by_signatory: false,
					placements: [],
					description: null
				}
			]
		};
	});
}

function createPDFfromString(content: string): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		const doc = new PDFDocument;
		const buffers: Buffer[] = [];

		doc.on('data', buffers.push.bind(buffers));
		doc.on('end', () => {
			const pdfData = Buffer.concat(buffers);
			resolve(pdfData);
		});
		doc.on('error', reject);

		doc.fontSize(12).text(content, 100, 100);
		doc.end();
	});
}