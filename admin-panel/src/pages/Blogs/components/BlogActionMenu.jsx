import { MoreHorizontal, Eye, CheckCircle, XCircle, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

export default function BlogActionMenu({ blog, onAction }) {
  const isPending = blog.status === "PENDING";
  const isApproved = blog.status === "APPROVED";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuItem onClick={() => onAction("view", blog)}>
          <Eye className="mr-2 h-4 w-4" />
          <span>Xem chi tiết</span>
        </DropdownMenuItem>

        {isApproved && (
          <DropdownMenuItem onClick={() => onAction("comments", blog)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Xem bình luận ({blog.stats?.comments || 0})</span>
          </DropdownMenuItem>
        )}

        {isPending && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onAction("approve", blog)}
              className="text-green-600"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>Phê duyệt</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onAction("reject", blog)}
              className="text-red-600"
            >
              <XCircle className="mr-2 h-4 w-4" />
              <span>Vi phạm</span>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => onAction("delete", blog)}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Xóa bài viết</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

