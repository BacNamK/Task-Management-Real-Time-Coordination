import { findUserByName } from '../users/users.Repository';

export const getUsers = async (name: string) => {
    return await findUserByName(name);
};
