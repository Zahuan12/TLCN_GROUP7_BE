import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { USER_ROLES, USER_STATUS, VERIFY_STATUS } from '../../../utils/constants';

/**
 * UserFilters - Filter controls for users
 */
export default function UserFilters({ filters, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Role Filter */}
      <Select
        value={filters.role || 'all'}
        onValueChange={(value) => onFilterChange('role', value === 'all' ? '' : value)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Tất cả roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả roles</SelectItem>
          <SelectItem value={USER_ROLES.STUDENT}>Sinh viên</SelectItem>
          <SelectItem value={USER_ROLES.COMPANY}>Công ty</SelectItem>
          <SelectItem value={USER_ROLES.ADMIN}>Admin</SelectItem>
        </SelectContent>
      </Select>

      {/* Active Status Filter */}
      <Select
        value={filters.isActive === '' ? 'all' : String(filters.isActive)}
        onValueChange={(value) => {
          if (value === 'all') {
            onFilterChange('isActive', '');
          } else {
            onFilterChange('isActive', value === 'true');
          }
        }}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="true">Hoạt động</SelectItem>
          <SelectItem value="false">Đã khóa</SelectItem>
        </SelectContent>
      </Select>

      {/* Verify Status Filter */}
      <Select
        value={filters.verifyStatus || 'all'}
        onValueChange={(value) => onFilterChange('verifyStatus', value === 'all' ? '' : value)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Xác thực" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value={VERIFY_STATUS.VERIFIED}>Đã xác thực</SelectItem>
          <SelectItem value={VERIFY_STATUS.UNVERIFIED}>Chưa xác thực</SelectItem>
          <SelectItem value={VERIFY_STATUS.INVALID}>Không hợp lệ</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {(filters.role || filters.isActive !== '' || filters.verifyStatus) && (
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

