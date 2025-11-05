import { MoreHorizontal, Eye, Users, BookOpen, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

export default function CareerPathActionMenu({ careerPath, onAction }) {
  const isPending = careerPath.status === "PENDING";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem onClick={() => onAction("view", careerPath)}>
          <Eye className="mr-2 h-4 w-4" />
          <span>Xem chi tiết</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onAction("students", careerPath)}>
          <Users className="mr-2 h-4 w-4" />
          <span>Danh sách học viên</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onAction("lessons", careerPath)}>
          <BookOpen className="mr-2 h-4 w-4" />
          <span>Các bài học</span>
        </DropdownMenuItem>

        {isPending && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onAction("approve", careerPath)}
              className="text-green-600"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>Phê duyệt</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onAction("reject", careerPath)}
              className="text-red-600"
            >
              <XCircle className="mr-2 h-4 w-4" />
              <span>Từ chối</span>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => onAction("edit", careerPath)}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Chỉnh sửa</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onAction("delete", careerPath)}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Xóa</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

