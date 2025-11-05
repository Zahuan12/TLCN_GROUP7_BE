import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Button } from '../../../components/ui/button';
import {
  MoreHorizontalIcon,
  EyeIcon,
  EditIcon,
  BanIcon,
  TrashIcon,
  FolderOpenIcon,
  ClipboardListIcon
} from 'lucide-react';

/**
 * CompanyActionMenu - Dropdown menu with company actions
 */
export default function CompanyActionMenu({ 
  company, 
  onView, 
  onEdit, 
  onSuspend, 
  onDelete,
  onViewPaths,
  onViewTests 
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontalIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView(company)}>
          <EyeIcon className="w-4 h-4 mr-2" />
          Xem chi tiết
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onViewPaths(company)}>
          <FolderOpenIcon className="w-4 h-4 mr-2" />
          Xem Career Paths
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onViewTests(company)}>
          <ClipboardListIcon className="w-4 h-4 mr-2" />
          Xem Tests
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => onEdit(company)}>
          <EditIcon className="w-4 h-4 mr-2" />
          Chỉnh sửa
        </DropdownMenuItem>
        
        {company.status === 'APPROVED' && (
          <DropdownMenuItem onClick={() => onSuspend(company)}>
            <BanIcon className="w-4 h-4 mr-2" />
            Tạm khóa
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => onDelete(company)}
          className="text-destructive"
        >
          <TrashIcon className="w-4 h-4 mr-2" />
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

