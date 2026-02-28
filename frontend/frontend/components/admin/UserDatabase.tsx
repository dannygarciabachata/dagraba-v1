'use client';

import React, { useMemo, useState } from 'react';
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
    SortingState
} from '@tanstack/react-table';
import { Server, MoreVertical, Edit2, ShieldBan } from 'lucide-react';

type UserData = {
    id: string;
    name: string;
    email: string;
    plan: 'Leyenda' | 'Capital' | 'Rookie';
    projects: number;
    status: 'Active' | 'Suspended';
};

const mockUsers: UserData[] = [
    { id: '1', name: 'Alvaro Diaz', email: 'alvaro@nebulondin.com', plan: 'Leyenda', projects: 12, status: 'Active' },
    { id: '2', name: 'Cazzu', email: 'jefa@cazzu.com', plan: 'Leyenda', projects: 8, status: 'Active' },
    { id: '3', name: 'User 0042', email: 'guest0042@gmail.com', plan: 'Rookie', projects: 1, status: 'Active' },
    { id: '4', name: 'Lit Killah', email: 'lit@killah.ar', plan: 'Capital', projects: 5, status: 'Active' },
    { id: '5', name: 'Spammer99', email: 'spam@bot.net', plan: 'Rookie', projects: 30, status: 'Suspended' },
];

const columnHelper = createColumnHelper<UserData>();

export function UserDatabase() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [data] = useState(() => [...mockUsers]);

    const columns = useMemo(() => [
        columnHelper.accessor('name', {
            header: 'ARTISTA',
            cell: info => <span className="font-bold text-[#E0E0E0]">{info.getValue()}</span>,
        }),
        columnHelper.accessor('email', {
            header: 'CORREO',
            cell: info => <span className="text-[#888]">{info.getValue()}</span>,
        }),
        columnHelper.accessor('plan', {
            header: 'PLAN',
            cell: info => {
                const plan = info.getValue();
                let colorClass = "text-[#888] bg-[#222]";
                if (plan === 'Leyenda') colorClass = "text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/30";
                if (plan === 'Capital') colorClass = "text-[#00F0FF] bg-[#00F0FF]/10 border border-[#00F0FF]/30";

                return (
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${colorClass}`}>
                        {plan}
                    </span>
                );
            },
        }),
        columnHelper.accessor('projects', {
            header: 'PROYECTOS',
            cell: info => <span className="text-white font-mono">{info.getValue()}</span>,
        }),
        columnHelper.accessor('status', {
            header: 'ESTADO',
            cell: info => (
                <span className={`flex items-center gap-1.5 text-xs font-bold ${info.getValue() === 'Active' ? 'text-green-500' : 'text-red-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${info.getValue() === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                    {info.getValue()}
                </span>
            ),
        }),
        columnHelper.display({
            id: 'actions',
            header: '',
            cell: () => (
                <div className="flex items-center justify-end gap-2">
                    <button className="p-1 text-[#666] hover:text-white transition-colors" title="Editar">
                        <Edit2 size={14} />
                    </button>
                    <button className="p-1 text-[#666] hover:text-red-500 transition-colors" title="Suspender">
                        <ShieldBan size={14} />
                    </button>
                    <button className="p-1 text-[#666] hover:text-white transition-colors">
                        <MoreVertical size={14} />
                    </button>
                </div>
            )
        })
    ], []);

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <section id="users" className="bg-[#0A0A0C]/80 backdrop-blur-md border border-[#333] rounded-xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col gap-6 mt-8">
            <div className="flex items-center justify-between border-b border-[#222] pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-[#FF6B00] to-orange-600 rounded-md">
                        <Server size={20} className="text-black" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-widest text-[#E0E0E0]">BASE DE DATOS Y ARTISTAS</h2>
                        <p className="text-xs text-[#888]">Gestión de Subscripciones y Proyectos mediante TanStack Table</p>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto border border-[#333] rounded-md bg-[#111]">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="text-[10px] text-[#888] uppercase tracking-widest border-b border-[#333] bg-[#0A0A0C]">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className="px-4 py-3 font-bold cursor-pointer hover:bg-[#222] transition-colors"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center gap-2">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: ' ↑',
                                                desc: ' ↓',
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-[#222]">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-[#1A1A1C] transition-colors">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="px-4 py-3">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
