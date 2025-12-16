export let BASE_ENDPOINT = '';

export const APP_ENVIRONMENT = 'local';

if (APP_ENVIRONMENT === 'local') {
  BASE_ENDPOINT = 'http://localhost:3000';
} else if (APP_ENVIRONMENT === 'development') {
  BASE_ENDPOINT = 'https://ppr-stats-dev.vercel.app';
} else if (APP_ENVIRONMENT === 'staging') {
  BASE_ENDPOINT = 'https://ppr-stats-staging.vercel.app';
} else if (APP_ENVIRONMENT === 'production') {
  BASE_ENDPOINT = 'https://ppr-stats.com';
}

const BASE_URL = `${BASE_ENDPOINT}/api/v1`;

export default function fetchClient(
  input: string | URL | Request,
  init?: RequestInit
): Promise<Response> {
  if (typeof input === 'string' && input.startsWith('/')) {
    input = BASE_URL + input;
  }
  return fetch(input, init);
}
