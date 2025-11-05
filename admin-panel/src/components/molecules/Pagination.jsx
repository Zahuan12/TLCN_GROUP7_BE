import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { PAGE_SIZE_OPTIONS } from '../../utils/constants';

/**
 * Pagination - Pagination component with page size selector
 * 
 * @param {Object} props
 * @param {number} props.currentPage - Current page number
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.pageSize - Items per page
 * @param {number} props.totalItems - Total number of items
 * @param {Function} props.onPageChange - Page change handler
 * @param {Function} props.onPageSizeChange - Page size change handler
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange
}) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if <= 7
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <Button
            key={i}
            variant={currentPage === i ? 'default' : 'outline'}
            size="sm"
            onClick={() => goToPage(i)}
            className="min-w-[40px]"
          >
            {i}
          </Button>
        );
      }
    } else {
      // Show with ellipsis
      pages.push(
        <Button
          key={1}
          variant={currentPage === 1 ? 'default' : 'outline'}
          size="sm"
          onClick={() => goToPage(1)}
          className="min-w-[40px]"
        >
          1
        </Button>
      );

      if (currentPage > 3) {
        pages.push(<span key="ellipsis1" className="px-2">...</span>);
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(
          <Button
            key={i}
            variant={currentPage === i ? 'default' : 'outline'}
            size="sm"
            onClick={() => goToPage(i)}
            className="min-w-[40px]"
          >
            {i}
          </Button>
        );
      }

      if (currentPage < totalPages - 2) {
        pages.push(<span key="ellipsis2" className="px-2">...</span>);
      }

      pages.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? 'default' : 'outline'}
          size="sm"
          onClick={() => goToPage(totalPages)}
          className="min-w-[40px]"
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      {/* Info */}
      <div className="text-sm text-muted-foreground">
        Hiển thị <span className="font-medium">{startItem}</span> đến{' '}
        <span className="font-medium">{endItem}</span> trong{' '}
        <span className="font-medium">{totalItems}</span> kết quả
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            Hiển thị
          </span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>

          <div className="hidden sm:flex items-center gap-1">
            {renderPageNumbers()}
          </div>

          {/* Mobile: Just show current page */}
          <div className="sm:hidden px-3 text-sm">
            {currentPage} / {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

