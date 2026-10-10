'use server';

import { api } from '../api.Interceptor';
import { UserType } from '../../types/user.type';

const AUTH_API_URL = '/auth/client';

export const authClient = {
    // For Client
    findUserByEmail: (email: string): Promise<UserType> =>
        api.get(AUTH_API_URL + '/user', { body: { email } }),

    createUser: (name: string, email: string, image: string) =>
        api.post(AUTH_API_URL + '/login', { body: { name, email, image } }),
};
