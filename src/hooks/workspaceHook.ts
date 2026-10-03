import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface ItemsState {
    workspace: any | null;
    members: any | null;
    setMembers: (members: any | null) => void;
    setWorkspace: (workspace: any | null) => void;
    reset: () => void;
}

export const useItemsStore = create<ItemsState>()(
    persist(
        (set) => ({
            workspace: null,
            members: null,
            setWorkspace: (workspace) =>
                set({
                    workspace,
                }),
            setMembers: (members) =>
                set({
                    members,
                }),

            reset: () =>
                set({
                    workspace: null,
                    members: null,
                }),
        }),
        {
            name: 'items-storage',
        }
    )
);
