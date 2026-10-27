'use client';

import { checkMember, addMember } from '../../../project/sevice/project.action';
import Image from 'next/image';
import { useState } from 'react';
import { Search, UsersRound } from 'lucide-react';
import type { projectMember, projectMemberSearchResult } from '../../sevice/project.type';

type MemberMatch = Extract<projectMemberSearchResult, { user: unknown }>;

const isMemberMatch = (result: projectMemberSearchResult | null): result is MemberMatch =>
    typeof result === 'object' && result !== null && 'user' in result && 'projectId' in result;

export const BoxMember = ({
    members,
    projectUuid,
}: {
    members: projectMember[];
    projectUuid: string;
}) => {
    const [memberSearch, setMemberSearch] = useState('');
    const [searchResult, setSearchResult] = useState<projectMemberSearchResult | null>(null);

    const showMessage = (message: string) => {
        setSearchResult(message);
        setTimeout(() => {
            setSearchResult(null);
        }, 10000);
    };

    async function searchUser(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const name = String(formData.get('name') ?? '').trim();
        if (!name) {
            return;
        }
        try {
            const result = await checkMember(projectUuid, name);
            if (typeof result === 'object' && result !== null && 'message' in result) {
                showMessage(result.message);
                return;
            }
            setSearchResult(result);
        } catch (error) {
            console.error('Failed to search for project member:', error);
            showMessage('Could not search for this account. Please try again.');
        }
    }

    const validateSearchResult = () => {
        return isMemberMatch(searchResult);
    };

    async function addMemberI(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();

        if (!isMemberMatch(searchResult)) {
            return;
        }
        try {
            await addMember(searchResult.projectId, searchResult.user.id);
            showMessage('Member added successfully');
        } catch (error) {
            console.error('Failed to add project member:', error);
            showMessage('Could not add this member. Please try again.');
        }
    }

    const filteredMembers = members.filter((member) => {
        const name = member.user?.name ?? member.name ?? '';
        return name.toLowerCase().includes(memberSearch.trim().toLowerCase());
    });
    const matchingUser = isMemberMatch(searchResult) ? searchResult : null;

    return (
        <div className="boxMember-project flex h-full min-h-0 w-full flex-col gap-5 overflow-y-auto sm:gap-6 sm:p-2">
            <div className="grid min-h-0 flex-1 grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.8fr)]">
                <section className="h-full min-w-0 rounded-2xl p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <label className="flex h-10 w-full items-center gap-2 border-b border-slate-200 px-3 transition focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 sm:max-w-xs">
                            <Search
                                size={16}
                                className="shrink-0 text-slate-400"
                                aria-hidden="true"
                            />
                            <input
                                type="search"
                                value={memberSearch}
                                onChange={(e) => setMemberSearch(e.target.value)}
                                placeholder="Search members..."
                                aria-label="Search project members"
                                className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                            />
                        </label>
                        <div className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                            <UsersRound size={16} aria-hidden="true" />
                            <span className="">{members.length}</span>
                            <span>{members.length === 1 ? 'Member' : 'Members'}</span>
                        </div>
                    </div>

                    {filteredMembers.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mt-4">
                            {filteredMembers.map((member, index) => {
                                const name = member.user?.name ?? member.name ?? 'Member';
                                const avatar = member.user?.image ?? member.avatar;

                                return (
                                    <div
                                        key={member.id ?? member.user?.id ?? index}
                                        className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition hover:border-slate-200 hover:bg-white hover:shadow-sm"
                                    >
                                        {avatar ? (
                                            <Image
                                                src={avatar}
                                                alt={name}
                                                width={34}
                                                height={34}
                                                className="shrink-0 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-700">
                                                {name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-slate-800">
                                                {name}
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-500">
                                                {member.role ?? 'Member'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex min-h-40 flex-col items-center justify-center px-4 py-8 text-center">
                            <div className="flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <UsersRound size={20} aria-hidden="true" />
                            </div>
                            <h4 className="mt-3 text-sm font-semibold text-slate-700">
                                {members.length === 0 ? 'No members yet' : 'No members found'}
                            </h4>
                            <p className="mt-1 text-sm text-slate-400">
                                {members.length === 0
                                    ? 'Add someone to start collaborating.'
                                    : 'Try a different name.'}
                            </p>
                        </div>
                    )}
                </section>

                <aside className=" p-4 bg-white sm:p-5">
                    <form onSubmit={searchUser} className="flex flex-col gap-3">
                        <label htmlFor="member-name" className="text-sm font-medium text-slate-700">
                            Account name
                        </label>
                        <div className="flex h-11 items-center overflow-hidden border-b border-slate-200 transition">
                            <input
                                type="text"
                                name="name"
                                id="member-name"
                                placeholder="Enter a name..."
                                className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-slate-400"
                            />
                            <button
                                type="submit"
                                aria-label="Search account"
                                className="flex h-full w-11 shrink-0 items-center justify-center text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                            >
                                <Search size={18} aria-hidden="true" />
                            </button>
                        </div>

                        {searchResult && (
                            <div
                                role="status"
                                className={`flex min-h-11 items-center justify-between gap-3 rounded-lg border px-3 py-2 ${
                                    matchingUser
                                        ? 'border-indigo-100 bg-indigo-50/70'
                                        : 'border-red-100 bg-red-50 text-red-600'
                                }`}
                            >
                                {matchingUser ? (
                                    <>
                                        <div className="flex min-w-0 items-center gap-2">
                                            {matchingUser.user.image ? (
                                                <Image
                                                    src={matchingUser.user.image}
                                                    alt={matchingUser.user.name ?? 'Member'}
                                                    width={32}
                                                    height={32}
                                                    className="size-8 shrink-0 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                                                    {matchingUser.user.name
                                                        ?.charAt(0)
                                                        .toUpperCase() ?? '?'}
                                                </div>
                                            )}
                                            <span className="truncate text-sm font-medium text-slate-800">
                                                {matchingUser.user.name}
                                            </span>
                                        </div>
                                        <span className="shrink-0 text-xs font-medium text-indigo-600">
                                            Found
                                        </span>
                                    </>
                                ) : (
                                    <p className="text-sm">
                                        {typeof searchResult === 'string'
                                            ? searchResult
                                            : searchResult && 'message' in searchResult
                                              ? searchResult.message
                                              : ''}
                                    </p>
                                )}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={addMemberI}
                            disabled={!validateSearchResult()}
                            className="mt-1 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                        >
                            Add to project
                        </button>
                    </form>
                </aside>
            </div>
        </div>
    );
};

export default BoxMember;
