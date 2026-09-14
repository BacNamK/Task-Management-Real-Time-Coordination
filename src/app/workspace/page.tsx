import { FormCreateWorkspace } from '@/src/components/forms/createWorkspace';
import ListWorkspace from '@/src/components/ui/ListWorkspace';

const Page = () => {
    return (
        <div className="w-full h-full">
            <FormCreateWorkspace />
            <ListWorkspace />
        </div>
    );
};

export default Page;
