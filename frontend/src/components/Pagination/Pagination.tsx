'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination as PaginationType } from '@/types';

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages, total, limit } = pagination;

  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-surface-border">
      <p className="text-sm text-slate-500">
        Showing <span className="text-slate-300 font-medium">{from}–{to}</span> of{' '}
        <span className="text-slate-300 font-medium">{total}</span> tasks
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className="px-2 text-slate-600 text-sm">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                p === page
                  ? 'bg-brand-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-surface-hover'
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
