import { useState } from 'react';
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
  LockIcon,
  UnlockIcon,
  TrashIcon,
  CheckCircleIcon
} from 'lucide-react';

/**
 * UserActionMenu - Dropdown menu with user actions
 */
export default function UserActionMenu({ user, onView, onEdit, onToggleActive, onVerify, onDelete }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontalIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView(user)}>
          <EyeIcon className="w-4 h-4 mr-2" />
          Xem chi tiết
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(user)}>
          <EditIcon className="w-4 h-4 mr-2" />
          Chỉnh sửa
        </DropdownMenuItem>
        
        {user.verifyStatus !== 'VERIFIED' && (
          <DropdownMenuItem onClick={() => onVerify(user)}>
            <CheckCircleIcon className="w-4 h-4 mr-2" />
            Xác thực
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => onToggleActive(user)}>
          {user.isActive ? (
            <>
              <LockIcon className="w-4 h-4 mr-2" />
              Khóa tài khoản
            </>
          ) : (
            <>
              <UnlockIcon className="w-4 h-4 mr-2" />
              Mở khóa
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => onDelete(user)}
          className="text-destructive"
        >
          <TrashIcon className="w-4 h-4 mr-2" />
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

