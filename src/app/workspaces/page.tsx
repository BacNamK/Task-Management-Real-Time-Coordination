import { getAllWorkspaces } from '../../service/workspace/workspace.action';
import WorkspacePageClient from '../../components/ui/workspace/PageClient';

const Page = async () => {
    const result = await getAllWorkspaces();
    return <WorkspacePageClient initialWorkspaces={result} />;
};

export default Page;
