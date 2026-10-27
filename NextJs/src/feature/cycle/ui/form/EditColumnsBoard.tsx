'use client';

import { useState, type FormEvent } from 'react';
import { Layers3, Plus, Trash2, X } from 'lucide-react';
import { deleteAction, putAction } from '../../../cycle/service/cylce.action';

type Column = {
    name: string;
    position: number;
};

type Cycle = {
    id: string;
    title: string;
    columns: Column[];
};

type Props = {
    cycle: Pick<Cycle, 'id' | 'title' | 'columns'>;
    boardId: string;
    setIsEditColumnsOpen: (value: boolean) => void;
};

const MAX_COLUMNS = 10;

const EditColumnsBoard = ({ cycle, setIsEditColumnsOpen }: Props) => {
    const [columns, setColumns] = useState<Column[]>(cycle.columns ?? []);
    const [nameCycle, setNameCycle] = useState(cycle.title);
    const [newColumnName, setNewColumnName] = useState('');
    const [columnError, setColumnError] = useState('');

    const addNewColumn = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const name = newColumnName.trim();

        if (!name) {
            setColumnError('Enter a name for your column.');
            return;
        }

        if (columns.length >= MAX_COLUMNS) {
            setColumnError(`You can add up to ${MAX_COLUMNS} columns.`);
            return;
        }

        setColumns((current) => [...current, { name, position: current.length }]);
        setNewColumnName('');
        setColumnError('');
    };

    const updateColumns = async () => {
        await putAction(cycle.id, { nameCycle, columns });
        setIsEditColumnsOpen(false);
    };

    const removeColumn = (position: number) => {
        setColumns((current) =>
            current
                .filter((column) => column.position !== position)
                .map((column, index) => ({ ...column, position: index }))
        );
    };

    const clearAllColumns = () => {
        setColumns([]);
        setColumnError('');
    };

    const deleteCycle = async (id: string) => {
        await deleteAction(id);
    };

    return (
        <div className="fixed inset-0 z-50 flex w-full items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
            <section
                aria-labelledby="edit-columns-title"
                aria-modal="true"
                className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20"
                role="dialog"
            >
                <header className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <Layers3 aria-hidden="true" size={19} />
                        </div>
                        <div>
                            <h2
                                className="text-sm font-semibold text-slate-900"
                                id="edit-columns-title"
                            >
                                Edit cycle
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-500">
                                Manage its name and workflow columns.
                            </p>
                        </div>
                    </div>
                    <button
                        aria-label="Close"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => setIsEditColumnsOpen(false)}
                        type="button"
                    >
                        <X aria-hidden="true" size={18} />
                    </button>
                </header>

                <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6 sm:px-7">
                    <div>
                        <label
                            className="mb-2 block text-sm font-semibold text-slate-900"
                            htmlFor="cycle-name"
                        >
                            Cycle name
                        </label>
                        <input
                            autoComplete="off"
                            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                            id="cycle-name"
                            onChange={(event) => setNameCycle(event.target.value)}
                            placeholder="Name this cycle"
                            type="text"
                            value={nameCycle}
                        />
                    </div>

                    <div>
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <div className="flex gap-4">
                                <h3 className="text-sm font-semibold text-slate-900">Columns</h3>
                                <button
                                    className="self-start rounded-lg text-sm transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent"
                                    disabled={columns.length === 0}
                                    onClick={clearAllColumns}
                                    type="button"
                                >
                                    Clear all
                                </button>
                            </div>
                            <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                {columns.length} / {MAX_COLUMNS}
                            </span>
                        </div>

                        {columns.length > 0 ? (
                            <ul className="grid gap-2 sm:grid-cols-3">
                                {columns.map((column) => (
                                    <li
                                        className="group flex min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 transition hover:border-indigo-200 hover:bg-indigo-50/50"
                                        key={`${column.position}-${column.name}`}
                                    >
                                        <span className="min-w-0 truncate text-sm font-medium text-slate-700">
                                            {column.name}
                                        </span>
                                        <button
                                            aria-label={`Remove ${column.name}`}
                                            className="shrink-0 rounded-lg p-1.5 text-slate-400 opacity-100 transition hover:bg-rose-100 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-rose-500 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                                            onClick={() => removeColumn(column.position)}
                                            type="button"
                                        >
                                            <Trash2 aria-hidden="true" size={15} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                                <Layers3
                                    aria-hidden="true"
                                    className="mx-auto text-slate-400"
                                    size={23}
                                />
                                <p className="mt-2 text-sm font-medium text-slate-700">
                                    No columns yet
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    Add a column to define the first stage of your workflow.
                                </p>
                            </div>
                        )}
                    </div>

                    <form className="space-y-2" onSubmit={addNewColumn}>
                        <label
                            className="block text-sm font-medium text-slate-700"
                            htmlFor="new-column"
                        >
                            Add a column
                        </label>
                        <div className="flex gap-2">
                            <input
                                className="min-w-0 flex-1 rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                                disabled={columns.length >= MAX_COLUMNS}
                                id="new-column"
                                maxLength={50}
                                onChange={(event) => {
                                    setNewColumnName(event.target.value);
                                    setColumnError('');
                                }}
                                placeholder="e.g. In progress"
                                value={newColumnName}
                            />
                            <button
                                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                                disabled={columns.length >= MAX_COLUMNS || !newColumnName.trim()}
                                type="submit"
                            >
                                Add
                                <Plus aria-hidden="true" size={16} />
                            </button>
                        </div>
                        {columnError ? (
                            <p className="text-xs text-rose-600" role="alert">
                                {columnError}
                            </p>
                        ) : (
                            <p className="text-xs text-slate-500">
                                Column names and their order can’t be changed after they’re added.
                            </p>
                        )}
                    </form>
                </div>

                <footer className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <button
                        className="self-start rounded-lg px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent"
                        disabled={columns.length === 0}
                        onClick={() => deleteCycle(cycle.id)}
                        type="button"
                    >
                        Delete Cycle
                    </button>
                    <div className="flex justify-end gap-2">
                        <button
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
                            onClick={() => setIsEditColumnsOpen(false)}
                            type="button"
                        >
                            Cancel
                        </button>
                        <button
                            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={updateColumns}
                            type="button"
                        >
                            Save changes
                        </button>
                    </div>
                </footer>
            </section>
        </div>
    );
};

export default EditColumnsBoard;
