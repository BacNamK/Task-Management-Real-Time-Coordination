import { api } from '../api.Interceptor';

const AUTH_API_URL = '/auth/server';

export const authServer = {
    // For Server
    verify: (token: string) => api.get(AUTH_API_URL + '/access', { body: { token } }),
    refreshToken: (token: string) => api.get(AUTH_API_URL + '/refresh', { body: { token } }),
};
