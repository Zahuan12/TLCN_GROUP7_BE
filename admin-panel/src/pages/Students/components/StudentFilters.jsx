import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { X } from "lucide-react";

const CAREER_PATHS = [
  { value: "ALL", label: "Tất cả lộ trình" },
  { value: "path-1", label: "Backend Development" },
  { value: "path-2", label: "Frontend Development" },
  { value: "path-3", label: "Data Science" },
  { value: "path-4", label: "Mobile App Development" }
];

const STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "ACTIVE", label: "Đang học" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "INACTIVE", label: "Không hoạt động" }
];

const UNIVERSITIES = [
  { value: "ALL", label: "Tất cả trường" },
  { value: "HCMUT", label: "Đại học Bách Khoa TP.HCM" },
  { value: "HUST", label: "Đại học Bách Khoa Hà Nội" },
  { value: "VNU", label: "Đại học Quốc gia" },
  { value: "UIT", label: "Đại học Công nghệ Thông tin" },
  { value: "FPT", label: "Đại học FPT" }
];

export default function StudentFilters({ filters, onFilterChange, onReset }) {
  const hasActiveFilters = 
    filters.careerPath !== "ALL" || 
    filters.status !== "ALL" || 
    filters.university !== "ALL";

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Career Path Filter */}
      <Select
        value={filters.careerPath}
        onValueChange={(value) => onFilterChange({ careerPath: value })}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Lộ trình" />
        </SelectTrigger>
        <SelectContent>
          {CAREER_PATHS.map((path) => (
            <SelectItem key={path.value} value={path.value}>
              {path.label}
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

      {/* University Filter */}
      <Select
        value={filters.university}
        onValueChange={(value) => onFilterChange({ university: value })}
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Trường" />
        </SelectTrigger>
        <SelectContent>
          {UNIVERSITIES.map((uni) => (
            <SelectItem key={uni.value} value={uni.value}>
              {uni.label}
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

