import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userType } from '../types/listWorkspace.Type';

interface ItemType {
    workspace: any;
    user: userType[];
}

interface ItemsState {
    items: ItemType[] | null;
    selectedItem: ItemType | null;
    workspace: any | null;

    setItems: (items: ItemType[]) => void;
    setSelectedItem: (item: ItemType | null) => void;
    setWorkspace: (workspace: any | null) => void;
    reset: () => void;
}

export const useItemsStore = create<ItemsState>()(
    persist(
        (set) => ({
            items: null,
            selectedItem: null,
            workspace: null,

            setItems: (items) => set({ items }),

            setSelectedItem: (item) => set({ selectedItem: item }),

            setWorkspace: (workspace) =>
                set({
                    workspace,
                    items: null,
                    selectedItem: null,
                }),

            reset: () =>
                set({
                    items: null,
                    selectedItem: null,
                    workspace: null,
                }),
        }),
        {
            name: 'items-storage',
        }
    )
);
