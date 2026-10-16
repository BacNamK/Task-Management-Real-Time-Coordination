import { UserType } from '../service/user/user.type';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const AUTH_API_URL = `${BASE_URL}/auth/users`;

import { getServiceToken } from '../service/token.service';

export const authClient = {
    // For Client
    findUserByEmail: async (email: string): Promise<UserType | null> =>
        await fetch(`${AUTH_API_URL}?email=${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${await getServiceToken()}`,
            },
        }).then((res) => {
            if (!res.ok) {
                throw new Error(`Failed to find user: ${res.status} ${res.statusText}`);
            }
            return res.json() as Promise<UserType | null>;
        }),
    createUser: async (name: string, email: string, image: string) =>
        await fetch(`${AUTH_API_URL}/create`, {
            method: 'POST',
            body: JSON.stringify({ name, email, image }),
        }).then((res) => res.json() as Promise<UserType>),
};
