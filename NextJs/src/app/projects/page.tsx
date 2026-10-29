import { getAll } from '../../feature/project/sevice/project.action';
import ProjectPageClient from '../../feature/project/ui/PageMain';

const Page = async () => {
    const projectAll = await getAll();
    return <ProjectPageClient initialprojects={projectAll} />;
};

export default Page;
