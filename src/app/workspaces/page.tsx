import { workspaceOwn } from '@/src/server/actions/workspace.action';
import WorkspacePageClient from '@/src/components/ui/workspace/PageClient';
import { workspaceRp } from '@/src/types/listWorkspace.Type';

const Page = async () => {
    // Tầng query đầu lấy danh sách Workspacce - Member
    const result = await workspaceOwn();

    return <WorkspacePageClient initialWorkspaces={result} />;
};

export default Page;
