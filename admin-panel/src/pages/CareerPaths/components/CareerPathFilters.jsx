import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { X } from "lucide-react";

const COMPANIES = [
  { id: 1, name: "TechCorp Vietnam" },
  { id: 2, name: "Digital Solutions Inc" },
  { id: 3, name: "Innovation Labs" },
  { id: 4, name: "Future Tech Co" },
  { id: 5, name: "Smart Systems" }
];

const STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "PENDING", label: "Chờ duyệt" },
  { value: "APPROVED", label: "Đã duyệt" },
  { value: "REJECTED", label: "Từ chối" }
];

const DIFFICULTY_OPTIONS = [
  { value: "ALL", label: "Tất cả cấp độ" },
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" }
];

export default function CareerPathFilters({ filters, onFilterChange, onReset }) {
  const hasActiveFilters = filters.companyId !== "ALL" || filters.status !== "ALL" || filters.difficulty !== "ALL";

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Company Filter */}
      <Select
        value={filters.companyId}
        onValueChange={(value) => onFilterChange({ companyId: value })}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Công ty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Tất cả công ty</SelectItem>
          {COMPANIES.map((company) => (
            <SelectItem key={company.id} value={company.id.toString()}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select
        value={filters.status}
        onValueChange={(value) => onFilterChange({ status: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Difficulty Filter */}
      <Select
        value={filters.difficulty}
        onValueChange={(value) => onFilterChange({ difficulty: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Cấp độ" />
        </SelectTrigger>
        <SelectContent>
          {DIFFICULTY_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-10 px-3"
        >
          <X className="h-4 w-4 mr-1" />
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );
}

