import { workspaceOwn } from '@/src/server/actions/workspace.action';
import WorkspacePageClient from '@/src/components/ui/workspace/PageClient';
import { workspaceRp } from '@/src/types/listWorkspace.Type';

const Page = async () => {
    const result = await workspaceOwn();
    const workspaces: workspaceRp =
        result && 'yourOwn' in result && 'yourMem' in result
            ? result
            : { yourOwn: [], yourMem: [] };

    return <WorkspacePageClient initialWorkspaces={workspaces} />;
};

export default Page;
