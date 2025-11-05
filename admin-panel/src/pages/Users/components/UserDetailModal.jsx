import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Badge } from '../../../components/ui/badge';
import StatusBadge from '../../../components/molecules/StatusBadge';
import { formatDateTime } from '../../../utils/formatDate';
import { ROLE_LABELS } from '../../../utils/constants';

/**
 * UserDetailModal - Modal showing user details
 */
export default function UserDetailModal({ user, open, onClose }) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết User</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="font-semibold mb-3">Thông tin cơ bản</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Username</label>
                <p className="font-medium">{user.username}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Họ tên</label>
                <p className="font-medium">{user.fullName || '—'}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Role</label>
                <p>
                  <Badge>{ROLE_LABELS[user.role]}</Badge>
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="font-semibold mb-3">Trạng thái</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Hoạt động</label>
                <p>
                  <StatusBadge status={user.isActive ? 'ACTIVE' : 'INACTIVE'} />
                </p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Xác thực</label>
                <p>
                  <StatusBadge status={user.verifyStatus} />
                </p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h3 className="font-semibold mb-3">Thời gian</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Ngày tạo</label>
                <p className="text-sm">{formatDateTime(user.createdDate)}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Đăng nhập cuối</label>
                <p className="text-sm">
                  {user.lastLogin ? formatDateTime(user.lastLogin) : 'Chưa đăng nhập'}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Info for Students */}
          {user.role === 'STUDENT' && user.profile && (
            <div>
              <h3 className="font-semibold mb-3">Thông tin sinh viên</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Trường</label>
                  <p className="font-medium">{user.profile.university || '—'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Chuyên ngành</label>
                  <p className="font-medium">{user.profile.major || '—'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Năm tốt nghiệp</label>
                  <p className="font-medium">{user.profile.graduationYear || '—'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Quan tâm</label>
                  <p className="font-medium">{user.profile.careerInterest || '—'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Additional Info for Companies */}
          {user.role === 'COMPANY' && user.profile && (
            <div>
              <h3 className="font-semibold mb-3">Thông tin công ty</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Tên công ty</label>
                  <p className="font-medium">{user.profile.companyName || '—'}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Ngành</label>
                  <p className="font-medium">{user.profile.industry || '—'}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-muted-foreground">Website</label>
                  <p className="font-medium">{user.profile.website || '—'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          {user.stats && (
            <div>
              <h3 className="font-semibold mb-3">Thống kê</h3>
              <div className="grid grid-cols-3 gap-4">
                {user.stats.testsTaken !== undefined && (
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">{user.stats.testsTaken}</p>
                    <p className="text-sm text-muted-foreground">Tests</p>
                  </div>
                )}
                {user.stats.avgScore !== undefined && (
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">{user.stats.avgScore}</p>
                    <p className="text-sm text-muted-foreground">Điểm TB</p>
                  </div>
                )}
                {user.stats.careerPathsJoined !== undefined && (
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold">{user.stats.careerPathsJoined}</p>
                    <p className="text-sm text-muted-foreground">Paths</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

