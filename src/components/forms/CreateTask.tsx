import { userType } from '@/src/types/listWorkspace.Type';

export const CreateTask = ({ user }: { user: userType }) => {
    return (
        <form>
            <input type="text" placeholder="Tên công việc" />
            <input type="text" placeholder="Mô tả công việc" />
            <input type="date" placeholder="Thời gian bắt đầu" />
            <input type="date" placeholder="Thời gian hoàn thành" />
            <input type="text" placeholder="Người Tạo" />
            <input type="text" placeholder="Người Thực hiện" />
        </form>
    );
};
