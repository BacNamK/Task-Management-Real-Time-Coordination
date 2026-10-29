import 'server-only';

import { getServiceToken } from './tokenServer.auth';
import { getSessionUser } from '../lib/auth/auth.session';

const BASE_URL = process.env.NEXT_PRIVATE_API_URL;

type RequestOptions = Omit<RequestInit, 'body'> & {
    body?: unknown;
};

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { body, headers, ...rest } = options;
    const session = await getSessionUser();
    const userId = session?.user?.id;

    if (!userId) {
        throw new Error('User ID is not available. Please ensure the user is authenticated.');
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...rest,
        headers: {
            'Content-Type': 'application/json',
            'User-Id': userId,
            Authorization: `Bearer ${await getServiceToken()}`,
            ...headers,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message ?? `HTTP Error: ${response.status}`);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

export const api = {
    get: <T>(url: string, options?: RequestOptions) =>
        request<T>(url, { ...options, method: 'GET' }),

    post: <T>(url: string, body?: unknown, options?: RequestOptions) =>
        request<T>(url, { ...options, method: 'POST', body }),

    put: <T>(url: string, body?: unknown, options?: RequestOptions) =>
        request<T>(url, { ...options, method: 'PUT', body }),

    patch: <T>(url: string, body?: unknown, options?: RequestOptions) =>
        request<T>(url, { ...options, method: 'PATCH', body }),

    delete: <T>(url: string, options?: RequestOptions) =>
        request<T>(url, { ...options, method: 'DELETE' }),
};
