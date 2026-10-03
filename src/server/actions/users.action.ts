'use server';

import { findUserByName } from '../users/users.Repository';

export const getUsersByNameAc = async (name: string) => {
    return await findUserByName(name);
};
