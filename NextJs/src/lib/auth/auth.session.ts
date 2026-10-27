import { auth } from '../auth/auth';

export async function getSessionUser() {
    return await auth();
}
