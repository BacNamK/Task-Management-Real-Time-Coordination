import { UserType } from '../feature/user/service/user.type';
import { getServiceToken } from './tokenServer.auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const AUTH_API_URL = `${BASE_URL}/auth/users`;

async function authHeaders(): Promise<HeadersInit> {
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await getServiceToken()}`,
    };
}

export const authClient = {
    findUserByEmail: async (email: string): Promise<UserType | null> => {
        const response = await fetch(`${AUTH_API_URL}?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: await authHeaders(),
            cache: 'no-store',
        });

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            throw new Error(`Failed to find user: ${response.status} ${response.statusText}`);
        }

        return response.json() as Promise<UserType | null>;
    },

    ensureUser: async (name: string, email: string, image: string | null): Promise<UserType> => {
        const response = await fetch(`${AUTH_API_URL}/ensure`, {
            method: 'POST',
            headers: await authHeaders(),
            body: JSON.stringify({ name, email, picture: image }),
            cache: 'no-store',
        });

        if (!response.ok) {
            const detail = await response.text().catch(() => '');
            throw new Error(`Failed to ensure user: ${response.status} ${detail}`);
        }

        return response.json() as Promise<UserType>;
    },
};
