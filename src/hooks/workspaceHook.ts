import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface ItemsState {
    project: any | null;
    members: any | null;
    setMembers: (members: any | null) => void;
    setproject: (project: any | null) => void;
    reset: () => void;
}

export const useItemsStore = create<ItemsState>()(
    persist(
        (set) => ({
            project: null,
            members: null,
            setproject: (project) =>
                set({
                    project,
                }),
            setMembers: (members) =>
                set({
                    members,
                }),

            reset: () =>
                set({
                    project: null,
                    members: null,
                }),
        }),
        {
            name: 'items-storage',
        }
    )
);
