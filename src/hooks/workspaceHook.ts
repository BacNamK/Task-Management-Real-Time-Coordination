import { create } from 'zustand';
import { userType } from '../types/listWorkspace.Type';

// 1. Định nghĩa Kiểu dữ liệu (TypeScript) nếu cần
interface ItemType {
    workspace: any;
    user: userType[];
    // ... các thuộc tính khác của item
}

interface ItemsState {
    items: ItemType[] | null;
    selectedItem: ItemType | null; // Nơi lưu Object đang được click
    setItems: (items: ItemType[]) => void;
    setSelectedItem: (item: ItemType | null) => void; // Hàm để cập nhật Object
}

// 2. Tạo Store duy nhất và export thẳng Hook này ra ngoài
export const useItemsStore = create<ItemsState>((set) => ({
    items: null,
    selectedItem: null, // Mặc định chưa có item nào được chọn

    setItems: (items) => set({ items: items }),
    setSelectedItem: (item) => set({ selectedItem: item }), // Hàm cập nhật Object
}));
