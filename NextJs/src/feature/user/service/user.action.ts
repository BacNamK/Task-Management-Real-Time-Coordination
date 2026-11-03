'use server';

import { api } from '../../../service/api.Interceptor';

const USER_API_PATH = '/users';

export class UserAction {
    constructor() {}
    async getByName(name: string) {
        if (!name) {
            throw new Error('Name is required');
        }
        const params = new URLSearchParams({ value: name });
        return await api.get(`${USER_API_PATH}/field?${params.toString()}`);
    }
}
