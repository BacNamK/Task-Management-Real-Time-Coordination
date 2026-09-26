import { useItemsStore } from '@/src/hooks/workspaceHook';

export function useWorkspaceUuid(): string {
    const selectedItem = useItemsStore((state) => state.selectedItem);

    return selectedItem?.workspace.uuid;
}
