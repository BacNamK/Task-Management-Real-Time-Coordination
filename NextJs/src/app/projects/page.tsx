import { getAll } from '../../feature/project/sevice/project.action';
import projectPageClient from '../../feature/project/ui/PageMain';

const Page = async () => {
    const projectAll = await getAll();
    return <projectPageClient initialprojects={projectAll} />;
};

export default Page;
