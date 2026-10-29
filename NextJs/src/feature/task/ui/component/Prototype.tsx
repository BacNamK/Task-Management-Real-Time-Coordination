import { CircleDot, Flag, FlagTriangleRight, Stamp, Tag, UsersRound } from 'lucide-react';
import Image from 'next/image';
import type { Task } from '../../service/task.type';

const getInitials = (name: string) =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('') || '?';

const Prototype = ({ task, stage }: { task: Task; stage: any }) => {
    return (
        <div>
            <div className="grid grid-cols-2 gap-y-4">
                <section className="flex gap-10">
                    <div className=" flex items-center gap-2 text-slate-500">
                        <UsersRound aria-hidden="true" className="" size={17} />
                        <h3 className="text-xs font-semibold ">Assignees</h3>
                    </div>
                    {task.assigneeds && (
                        <ul className="space-y-2">
                            {task.assigneeds.map(({ id, user }) => (
                                <li className="flex items-center gap-3" key={id}>
                                    {user.avatar ? (
                                        <Image
                                            src={user.avatar}
                                            width={24}
                                            height={24}
                                            alt={user.name}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <span className="flex size-7 items-center justify-center rounded-full bg-indigo-50 text-[10px] font-semibold text-indigo-700">
                                            {getInitials(user.name)}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <div className="flex gap-2 items-center text-slate-500">
                    <Tag size={17} />
                    <span className="text-xs font-semibold">Tags</span>
                </div>

                <div className="flex items-center gap-15 text-slate-500">
                    <div className="flex gap-2">
                        <CircleDot size={17} />
                        <span className="text-xs font-semibold">Stage</span>
                    </div>
                    <span className="text-xs bg-gray-200 rounded-full text-center p-0.5 pl-2 pr-2">
                        {stage[0].name}
                    </span>
                </div>

                <div className="flex items-center gap-10 text-slate-500">
                    <div className="flex gap-2">
                        <Flag size={17} />
                        <span className="text-xs font-semibold">Priority</span>
                    </div>
                    <span className="text-sm bg-gray-200 rounded-full size-5 text-center">
                        {task.priority}
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-10  mt-4">
                <div className="flex gap-2 text-slate-500">
                    <Stamp size={17} />
                    <span className="text-xs font-semibold">Censor </span>
                </div>
                <div className="text-sm text-center p-0.5 pl-2 pr-2">
                    {task.censor ? (
                        <div className="flex gap-2">
                            <Image
                                src={task.censor.avatar}
                                className="rounded-full"
                                width={24}
                                height={24}
                                alt=""
                            ></Image>
                            <span className="text-xs font-semibold">{task.censor.name}</span>
                        </div>
                    ) : (
                        <span className="text-xs bg-gray-200 rounded-full text-center p-0.5 pl-2 pr-2">
                            Task not yet at the final stage or not yet confirmed
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Prototype;
