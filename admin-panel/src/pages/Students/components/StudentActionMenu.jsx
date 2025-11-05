import { MoreHorizontal, Eye, TrendingUp, FileCheck, Edit, UserX, Award } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

export default function StudentActionMenu({ student, onAction }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem onClick={() => onAction("view", student)}>
          <Eye className="mr-2 h-4 w-4" />
          <span>Xem chi tiết</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onAction("progress", student)}>
          <TrendingUp className="mr-2 h-4 w-4" />
          <span>Tiến độ học tập</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onAction("tests", student)}>
          <FileCheck className="mr-2 h-4 w-4" />
          <span>Kết quả bài test</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onAction("achievements", student)}>
          <Award className="mr-2 h-4 w-4" />
          <span>Thành tích</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => onAction("edit", student)}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Chỉnh sửa</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onAction("suspend", student)}
          className="text-red-600"
        >
          <UserX className="mr-2 h-4 w-4" />
          <span>Tạm khóa tài khoản</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

