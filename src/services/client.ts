export const BASE_ENDPOINT = '';

const BASE_URL = `${BASE_ENDPOINT}/api`;

export default function fetchClient(
  input: string | URL | Request,
  init?: RequestInit
): Promise<Response> {
  if (typeof input === 'string' && input.startsWith('/')) {
    input = BASE_URL + input;
  }
  return fetch(input, init);
}
