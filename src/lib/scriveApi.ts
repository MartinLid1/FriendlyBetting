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
const USER_ID = env.SCRIVE_USER_ID;

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

export async function createNewDocument(documentContents: string, saved: boolean = true): Promise<any> {
	const formData = new FormData();
	const pdf: Buffer = await createPDFfromString(documentContents);

	formData.append('file', pdf, {
		filename: uuidv4() + '.pdf',
		contentType: 'application/pdf'
	});

	formData.append('saved', saved.toString());

	return fetchFromApi('/documents/new', 'POST', formData, 'multipart/form-data');
}

export async function getDocumentList(): Promise<any> {
	return fetchFromApi(`/documents/list`);
}

export async function getDocument(documentId: string): Promise<any> {
	return fetchFromApi(`/documents/${documentId}/get`);
}

export async function updateDocument(documentId: string, updates: any): Promise<any> {
	return fetchFromApi(`/documents/${documentId}/update`, 'POST', updates);
}

export async function setSignatories(documentId: string, signatories: any[]): Promise<any> {
	return fetchFromApi(`/documents/${documentId}/setattachments`, 'POST', { signatories });
}

export async function startSigning(documentId: string): Promise<any> {
	return fetchFromApi(`/documents/${documentId}/start`, 'POST');
}

export async function getDocumentStatus(documentId: string): Promise<any> {
	return fetchFromApi(`/documents/${documentId}/getstatus`);
}

export async function cancelDocument(documentId: string): Promise<any> {
	return fetchFromApi(`/documents/${documentId}/cancel`, 'POST');
}

export async function initiateSigningProcess(documentId: string, signatories: any[]): Promise<any> {
	await setSignatories(documentId, signatories);

	const startResult = await startSigning(documentId);

	const status = await getDocumentStatus(documentId);

	return { startResult, status };
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