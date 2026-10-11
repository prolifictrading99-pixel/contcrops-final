"use client"

import type { ReactNode } from "react"

type Column<T> = {
  key: string
  label: string
  hideOnCard?: boolean
  className?: string
  render?: (row: T) => ReactNode
}

export function ResponsiveDataList<T extends { id?: string | number }>({
  columns,
  rows,
  empty,
  onRowClick,
}: {
  columns: Column<T>[]
  rows: T[]
  empty: string
  onRowClick?: (row: T) => void
}) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-right text-sm">
          <thead className="bg-[#f8faf7] text-[11px] font-bold text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={`whitespace-nowrap px-4 py-3 ${column.className || ""}`}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr
                key={(row.id as string) || index}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? "cursor-pointer hover:bg-emerald-50/40" : "hover:bg-emerald-50/40"}
              >
                {columns.map((column) => (
                  <td key={column.key} className={`px-4 py-3 align-top ${column.className || ""}`}>
                    {column.render ? column.render(row) : (row as Record<string, unknown>)[column.key] as ReactNode}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 p-3 md:hidden">
        {rows.map((row, index) => (
          <article
            key={(row.id as string) || index}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            {columns.filter((column) => !column.hideOnCard).map((column) => (
              <div key={column.key} className="flex items-start justify-between gap-3 border-b border-slate-50 py-2 last:border-0">
                <span className="shrink-0 text-[11px] font-bold text-slate-400">{column.label}</span>
                <span className="min-w-0 text-left text-xs font-bold text-slate-800">
                  {column.render ? column.render(row) : (row as Record<string, unknown>)[column.key] as ReactNode}
                </span>
              </div>
            ))}
          </article>
        ))}
      </div>
      {rows.length === 0 && <p className="px-4 py-10 text-center text-xs text-slate-500">{empty}</p>}
    </>
  )
}
