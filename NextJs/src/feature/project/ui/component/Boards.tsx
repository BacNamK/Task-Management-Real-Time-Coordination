'use client';

import Link from 'next/link';
import { ClipboardPenLine } from 'lucide-react';
import type { projectDetail } from '../../sevice/project.type';

type Props = {
    boards: projectDetail['boards'];
    projectUuid: string;
};

const Boards = ({ boards, projectUuid }: Props) => {
    return (
        <div className="flex flex-col gap-5">
            {boards.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {boards.map((board) => (
                        <Link
                            href={`/projects/${projectUuid}/${board.id}?view=boards`}
                            key={board.id}
                            className="group flex min-w-0 flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                        <ClipboardPenLine aria-hidden="true" size={17} />
                                    </div>
                                    <h3 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600">
                                        {board.title}
                                    </h3>
                                </div>
                            </div>

                            <div className="w-full text-xs text-slate-600">{board.description}</div>

                            <div className="flex items-center gap-4 text-slate-500">
                                <span className="text-xs">{board._count?.cycle ?? 0} Cycles</span>
                                <span className="text-xs">{board._count?.tasks ?? 0} Tasks</span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
                    <h3 className="mt-4 text-sm font-semibold text-slate-700">No boards yet</h3>
                    <p className="mt-1 text-sm text-slate-400">
                        Create a board to start organizing your work.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Boards;
