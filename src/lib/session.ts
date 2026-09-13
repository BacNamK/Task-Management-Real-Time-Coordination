import { auth } from '@/src/lib/auth';

export async function getSessionUser() {
    const session = await auth();

    return {
        userName: session?.user?.name ?? 'User',
        userImage: session?.user?.image ?? 'https://api.dicebear.com/7.x/initials/svg?seed=User',
    };
}
