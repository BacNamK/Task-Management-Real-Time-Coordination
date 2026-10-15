import { UserType } from '../../types/user.type';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const AUTH_API_URL = `${BASE_URL}/api/v1/auth/users`;

export const authClient = {
    // For Client
    findUserByEmail: async (email: string): Promise<UserType> =>
        await fetch(`${AUTH_API_URL}?email=${email}`).then(
            (res) => res.json() as Promise<UserType>
        ),
    createUser: async (name: string, email: string, image: string) =>
        await fetch(`${AUTH_API_URL}/create`, {
            method: 'POST',
            body: JSON.stringify({ name, email, image }),
        }).then((res) => res.json() as Promise<UserType>),
};
