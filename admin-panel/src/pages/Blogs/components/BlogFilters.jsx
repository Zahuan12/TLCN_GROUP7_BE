import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { X } from "lucide-react";

const CATEGORIES = [
  { value: "ALL", label: "Tất cả danh mục" },
  { value: "Career Guide", label: "Hướng nghiệp" },
  { value: "Tutorial", label: "Hướng dẫn" },
  { value: "Interview Tips", label: "Phỏng vấn" },
  { value: "Industry News", label: "Tin tức" },
  { value: "Success Stories", label: "Câu chuyện thành công" }
];

const AUTHOR_ROLES = [
  { value: "ALL", label: "Tất cả tác giả" },
  { value: "STUDENT", label: "Sinh viên" },
  { value: "COMPANY", label: "Doanh nghiệp" },
  { value: "ADMIN", label: "Admin" }
];

export default function BlogFilters({ filters, onFilterChange, onReset }) {
  const hasActiveFilters = filters.category !== "ALL" || filters.authorRole !== "ALL";

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Category Filter */}
      <Select
        value={filters.category}
        onValueChange={(value) => onFilterChange({ category: value })}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Danh mục" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Author Role Filter */}
      <Select
        value={filters.authorRole}
        onValueChange={(value) => onFilterChange({ authorRole: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Tác giả" />
        </SelectTrigger>
        <SelectContent>
          {AUTHOR_ROLES.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              {role.label}
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

