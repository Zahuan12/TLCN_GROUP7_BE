import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { COMPANY_STATUS } from '../../../utils/constants';

/**
 * CompanyFilters - Filter controls for companies
 */
export default function CompanyFilters({ filters, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Status Filter */}
      <Select
        value={filters.status || 'all'}
        onValueChange={(value) => onFilterChange('status', value === 'all' ? '' : value)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value={COMPANY_STATUS.PENDING}>Chờ duyệt</SelectItem>
          <SelectItem value={COMPANY_STATUS.APPROVED}>Đã duyệt</SelectItem>
          <SelectItem value={COMPANY_STATUS.REJECTED}>Từ chối</SelectItem>
          <SelectItem value={COMPANY_STATUS.SUSPENDED}>Tạm khóa</SelectItem>
        </SelectContent>
      </Select>

      {/* Industry Filter */}
      <Select
        value={filters.industry || 'all'}
        onValueChange={(value) => onFilterChange('industry', value === 'all' ? '' : value)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Ngành" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả ngành</SelectItem>
          <SelectItem value="IT Services">IT Services</SelectItem>
          <SelectItem value="Telecommunications">Telecommunications</SelectItem>
          <SelectItem value="Software Development">Software Development</SelectItem>
          <SelectItem value="E-commerce">E-commerce</SelectItem>
          <SelectItem value="Finance">Finance</SelectItem>
          <SelectItem value="Education">Education</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {(filters.status || filters.industry) && (
        <button
          onClick={() => onFilterChange('clear')}
          className="text-sm text-muted-foreground hover:text-foreground underline"
        >
          Xóa bộ lọc
        </button>
      )}
    </div>
  );
}

