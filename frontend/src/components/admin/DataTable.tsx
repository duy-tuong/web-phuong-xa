"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  emptyMessage = "Không có dữ liệu",
  pagination,
}: DataTableProps<T>) {
  const hasPagination = Boolean(pagination && pagination.total > pagination.pageSize);
  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.total / pagination.pageSize))
    : 1;

  const buildPages = () => {
    if (!pagination) return [];
    const { page } = pagination;
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }

    const pages: (number | string)[] = [1];
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i += 1) pages.push(i);
    if (end < totalPages - 1) pages.push("...");

    pages.push(totalPages);
    return pages;
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="text-center py-12 text-stone-400">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-stone-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <span className="text-sm">{emptyMessage}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      {/* Mobile cards */}
      <div className="divide-y divide-stone-100 md:hidden">
        {data.map((item) => (
          <article key={item.id} className="p-3 sm:p-4">
            <div className="space-y-2.5">
              {columns.map((col, index) => (
                <div
                  key={col.key}
                  className={cn(
                    "flex items-start gap-3",
                    index > 0 && "pt-2 border-t border-dashed border-stone-100"
                  )}
                >
                  <span className="w-[112px] shrink-0 text-xs font-bold uppercase tracking-wide text-stone-600">
                    {col.label}
                  </span>
                  <div className="min-w-0 flex-1 text-right text-sm text-stone-700">
                    {col.render
                      ? col.render(item)
                      : ((item as Record<string, unknown>)[col.key] as ReactNode)}
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-stone-50 hover:bg-stone-50">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`text-sm font-bold text-stone-700 uppercase tracking-wide ${col.className || ""}`}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-stone-50/50 transition-colors"
              >
                {columns.map((col) => (
                  <TableCell key={col.key} className={col.className || ""}>
                    {col.render
                      ? col.render(item)
                      : ((item as Record<string, unknown>)[col.key] as ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {hasPagination && pagination && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-t border-stone-200 bg-stone-50">
          <div className="text-sm text-stone-500">
            Hiển thị
            <span className="font-medium text-stone-700"> {Math.min(
              (pagination.page - 1) * pagination.pageSize + 1,
              pagination.total
            )}</span>
            -
            <span className="font-medium text-stone-700"> {Math.min(
              pagination.page * pagination.pageSize,
              pagination.total
            )}</span>
            trong {pagination.total}
          </div>

          <div className="flex items-center gap-1 justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-stone-600"
              disabled={pagination.page === 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              {"<"}
            </Button>

            {buildPages().map((p, idx) =>
              typeof p === "number" ? (
                <Button
                  key={`${p}-${idx}`}
                  variant={p === pagination.page ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-9 px-3 text-sm",
                    p === pagination.page
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "text-stone-700"
                  )}
                  onClick={() => pagination.onPageChange(p)}
                >
                  {p}
                </Button>
              ) : (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-stone-400 select-none"
                >
                  ...
                </span>
              )
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-stone-600"
              disabled={pagination.page >= totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              {">"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
