import { checkWorkspaceMemberAc } from '@/src/server/actions/workspace.action';
import { addWorkspaceMember } from '@/src/server/actions/workspace.action';
import Image from 'next/image';
import { useState } from 'react';

export const BoxMember = ({
    members,
    workspaceUuid,
}: {
    members: any[];
    workspaceUuid: string;
}) => {
    const [isAddMember, setIsAddMember] = useState(false);

    const [searchResult, setSearchResult] = useState<any>('');

    const showMessage = (message: string) => {
        setSearchResult(message);
        setTimeout(() => {
            setSearchResult('');
        }, 10000);
    };

    // Tìm người dùng có tồn tại không và kiểm tra đã có trong workspaceMember hay chưa
    async function searchUser(e: any) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const name = formData.get('name') as string;
        if (!name) {
            return;
        }
        const result: any | string = await checkWorkspaceMemberAc(workspaceUuid, name);
        if (result?.message) {
            showMessage(result.message);
            return;
        }
        // lưu kết quả tìm object người dùng | String message
        setSearchResult(result);
    }

    const validateSearchResult = () => {
        return Boolean(searchResult?.user && searchResult?.workspaceId);
    };

    // sau khi searchResult có object người dùng thì mới cho thêm vào workspaceMember
    async function addMember(e: any) {
        e.preventDefault();

        if (!validateSearchResult()) {
            return;
        }
        await addWorkspaceMember({
            workspaceId: searchResult.workspaceId,
            userId: searchResult.user.id,
        });
        showMessage('Member added successfuly');
    }

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-white">
            {/* Add member */}
            <div className="shrink-0 border-b border-gray-200">
                <button
                    onClick={() => setIsAddMember(!isAddMember)}
                    className="flex w-full items-center justify-between px-4 py-3 font-semibold text-gray-400 transition hover:bg-gray-50"
                >
                    <span className="flex items-center gap-2">
                        Add member{' '}
                        <span
                            className={`transition-transform duration-300 ${isAddMember ? 'rotate-90' : ''}`}
                        >
                            {' '}
                            &#8250;{' '}
                        </span>
                    </span>
                </button>

                {isAddMember && (
                    <div className="flex flex-col gap-3 px-4 pb-4">
                        {/* Search user */}
                        <form
                            onSubmit={searchUser}
                            className="flex h-10 w-full items-center overflow-hidden rounded-[5px] border border-gray-200 bg-gray-50 transition "
                        >
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Search by name..."
                                className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-gray-400"
                            />

                            <button
                                type="submit"
                                className="flex h-full w-10 shrink-0 items-center justify-center text-gray-500 transition hover:bg-blue-200 hover:text-gray-800"
                            >
                                <Image src="/search.png" alt="search" width={20} height={20} />
                            </button>
                        </form>

                        {/* Search result */}
                        {searchResult && (
                            <div className="flex min-h-10 items-center justify-between gap-2 rounded-[5px] border-b border-gray-200p-2">
                                {searchResult?.user ? (
                                    <>
                                        <div className="flex min-w-0 items-center gap-2">
                                            {searchResult.user.image ? (
                                                <Image
                                                    src={searchResult.user.image}
                                                    alt={searchResult.user.name}
                                                    width={28}
                                                    height={28}
                                                    className="size-8 shrink-0 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                                                    {searchResult.user.name
                                                        ?.charAt(0)
                                                        .toUpperCase() ?? '?'}
                                                </div>
                                            )}

                                            <span className="truncate text-sm font-medium text-gray-700">
                                                {searchResult.user.name}
                                            </span>
                                        </div>

                                        <span className="shrink-0 text-xs text-blue-600">
                                            Found
                                        </span>
                                    </>
                                ) : (
                                    <p className="text-sm text-red-400">
                                        {typeof searchResult === 'string' ? searchResult : ''}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Confirm */}
                        <button
                            type="button"
                            onClick={addMember}
                            disabled={!validateSearchResult()}
                            className="w-full rounded-[5px] bg-blue-600 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                        >
                            Add to workspace
                        </button>
                    </div>
                )}
            </div>

            {/* Member header */}
            <div className="shrink-0 px-4 pb-2 pt-4">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-md font-semibold text-gray-400">Members</h2>

                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                        {members.length}
                    </span>
                </div>

                {/* Search member */}
                <div className="flex h-9 items-center gap-2 rounded-[5px] border-b-2 border-gray-200 px-3">
                    <input
                        type="text"
                        placeholder="Search members..."
                        className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-sm"
                    />
                </div>
            </div>

            {/* Member list */}
            <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
                <div className="flex flex-col gap-1">
                    {members.map((member: any, index: number) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 rounded-lg px-4 py-2 transition hover:bg-gray-50"
                        >
                            {member.user.image ? (
                                <Image
                                    src={member.user.image}
                                    alt={member.user.name}
                                    width={30}
                                    height={30}
                                    className="shrink-0 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-500">
                                    {member.user.name?.charAt(0).toUpperCase() ?? '?'}
                                </div>
                            )}

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-700">
                                    {member.user.name}
                                </p>
                                <p className="text-xs text-gray-400">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {members.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <p className="mt-2 text-sm text-gray-500">No members yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BoxMember;
