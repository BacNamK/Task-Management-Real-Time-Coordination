'use server';

import { api } from '../../lib/api/api.Interceptor';

const USER_API_PATH = '/users';

export class UserAction {
    constructor() {}
    async getByName(name: string) {
        if (!name) {
            throw new Error('Name is required');
        }
        return await api.get(`${USER_API_PATH}/${name}`);
    }
}
