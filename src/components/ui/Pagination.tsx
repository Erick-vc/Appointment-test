import { ChevronLeft, ChevronRight } from "@assets/icons";
import Select from "./Select";

const PAGE_SIZE_OPTIONS = ["5", "10", "15", "20", "50"];

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: number) => void;
  className?: string;
}

const getVisiblePages = (currentPage: number, totalPages: number) => {
  if (totalPages <= 3) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 2) {
    return [1, 2, 3];
  }

  if (currentPage >= totalPages - 1) {
    return [totalPages - 2, totalPages - 1, totalPages];
  }

  return [currentPage - 1, currentPage, currentPage + 1];
};

export const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  className = "",
}: PaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const visiblePages = getVisiblePages(currentPage, totalPages);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const pageSizeOptions = PAGE_SIZE_OPTIONS.map((value) => ({
    id: value,
    label: value,
  }));

  const iconClassName = "h-4 w-4";
  const navButtonClassName =
    "flex h-8 w-8 items-center justify-center rounded-md text-[#4B5675] transition-colors hover:bg-[#F5F7FA] disabled:cursor-not-allowed disabled:opacity-40";
  const pageButtonClassName =
    "flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[14px] font-medium transition-colors";

  return (
    <div
      className={`flex flex-col gap-3 border-t border-[#F1F1F4] px-6 py-4 md:flex-row md:items-center md:justify-between ${className}`}
    >
      <div className="flex items-center gap-3 text-[14px] text-[#4B5675]">
        <span>Mostrar</span>
        <div className="w-[92px]">
          <Select
            value={String(itemsPerPage)}
            onChange={(value) => onItemsPerPageChange(Number(value))}
            options={pageSizeOptions}
            searchable={false}
            className="h-9"
          />
        </div>
        <span>por p&aacute;gina</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          className={navButtonClassName}
          onClick={() => onPageChange(1)}
          disabled={isFirstPage}
          aria-label="Primera página"
        >
          <div className="relative flex h-4 w-4 items-center justify-center">
            <ChevronLeft className={`${iconClassName} absolute left-0`} />
            <ChevronLeft className={`${iconClassName} absolute left-[5px]`} />
          </div>
        </button>
        <button
          type="button"
          className={navButtonClassName}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          aria-label="Página anterior"
        >
          <ChevronLeft className={iconClassName} />
        </button>

        {visiblePages.map((page) => (
          <button
            key={page}
            type="button"
            className={`${pageButtonClassName} ${
              currentPage === page
                ? "bg-[#F3F3F3] text-[#252F4A]"
                : "text-[#4B5675] hover:bg-[#F5F7FA]"
            }`}
            onClick={() => onPageChange(page)}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          className={navButtonClassName}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
          aria-label="Página siguiente"
        >
          <ChevronRight className={iconClassName} />
        </button>
        <button
          type="button"
          className={navButtonClassName}
          onClick={() => onPageChange(totalPages)}
          disabled={isLastPage}
          aria-label="Última página"
        >
          <div className="relative flex h-4 w-4 items-center justify-center">
            <ChevronRight className={`${iconClassName} absolute right-0`} />
            <ChevronRight className={`${iconClassName} absolute right-[5px]`} />
          </div>
        </button>
      </div>
    </div>
  );
};
