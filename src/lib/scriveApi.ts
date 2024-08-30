import { env } from '$env/dynamic/private';

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

async function fetchFromApi(endpoint: string) {
	const url = `${API_BASE_URL}${endpoint}`;

	const headers = {
		'Authorization': getAuthorizationHeader()
	};

	const response = await fetch(url, {
		method: 'GET',
		headers: headers
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch: ${response.statusText}`);
	}

	return await response.json();
}

export async function getUserRoles() {
	return await fetchFromApi(`/getuserroles/${USER_ID}`);
}