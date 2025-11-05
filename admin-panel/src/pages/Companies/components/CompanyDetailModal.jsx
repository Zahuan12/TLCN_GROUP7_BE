import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Badge } from '../../../components/ui/badge';
import StatusBadge from '../../../components/molecules/StatusBadge';
import { formatDateTime } from '../../../utils/formatDate';
import { ExternalLinkIcon } from 'lucide-react';

/**
 * CompanyDetailModal - Modal showing company details
 */
export default function CompanyDetailModal({ company, open, onClose }) {
  if (!company) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết Công ty</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="font-semibold mb-3">Thông tin cơ bản</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Tên công ty</label>
                <p className="font-medium">{company.companyName}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Ngành</label>
                <p className="font-medium">{company.industry || '—'}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm text-muted-foreground">Website</label>
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    {company.website}
                    <ExternalLinkIcon className="w-3 h-3" />
                  </a>
                ) : (
                  <p className="font-medium">—</p>
                )}
              </div>
              <div className="col-span-2">
                <label className="text-sm text-muted-foreground">Mô tả</label>
                <p className="text-sm">{company.description || '—'}</p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="font-semibold mb-3">Trạng thái</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Status</label>
                <p>
                  <StatusBadge status={company.status} />
                </p>
              </div>
              {company.status === 'APPROVED' && company.approvedDate && (
                <div>
                  <label className="text-sm text-muted-foreground">Ngày duyệt</label>
                  <p className="text-sm">{formatDateTime(company.approvedDate)}</p>
                </div>
              )}
              {company.status === 'REJECTED' && (
                <>
                  <div>
                    <label className="text-sm text-muted-foreground">Ngày từ chối</label>
                    <p className="text-sm">{formatDateTime(company.rejectedDate)}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm text-muted-foreground">Lý do từ chối</label>
                    <p className="text-sm text-destructive">{company.rejectionReason || '—'}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Dates */}
          <div>
            <h3 className="font-semibold mb-3">Thời gian</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Ngày đăng ký</label>
                <p className="text-sm">{formatDateTime(company.registeredDate)}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          {company.documents && (
            <div>
              <h3 className="font-semibold mb-3">Giấy tờ</h3>
              <div className="grid grid-cols-2 gap-4">
                {company.documents.businessLicense && (
                  <div>
                    <label className="text-sm text-muted-foreground">Giấy phép kinh doanh</label>
                    <a
                      href={company.documents.businessLicense}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      Xem file
                      <ExternalLinkIcon className="w-3 h-3" />
                    </a>
                  </div>
                )}
                {company.documents.taxCode && (
                  <div>
                    <label className="text-sm text-muted-foreground">Mã số thuế</label>
                    <p className="font-medium">{company.documents.taxCode}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stats */}
          {company.stats && (
            <div>
              <h3 className="font-semibold mb-3">Thống kê</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{company.stats.careerPathsCount || 0}</p>
                  <p className="text-sm text-muted-foreground">Career Paths</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{company.stats.testsCount || 0}</p>
                  <p className="text-sm text-muted-foreground">Tests</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{company.stats.studentsReached || 0}</p>
                  <p className="text-sm text-muted-foreground">Students</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">
                    {company.stats.avgTestScore ? company.stats.avgTestScore.toFixed(1) : '—'}
                  </p>
                  <p className="text-sm text-muted-foreground">Điểm TB</p>
                </div>
              </div>
            </div>
          )}

          {/* Contact Info */}
          {(company.contactEmail || company.contactPhone || company.address) && (
            <div>
              <h3 className="font-semibold mb-3">Liên hệ</h3>
              <div className="grid grid-cols-2 gap-4">
                {company.contactEmail && (
                  <div>
                    <label className="text-sm text-muted-foreground">Email liên hệ</label>
                    <p className="text-sm">{company.contactEmail}</p>
                  </div>
                )}
                {company.contactPhone && (
                  <div>
                    <label className="text-sm text-muted-foreground">Số điện thoại</label>
                    <p className="text-sm">{company.contactPhone}</p>
                  </div>
                )}
                {company.address && (
                  <div className="col-span-2">
                    <label className="text-sm text-muted-foreground">Địa chỉ</label>
                    <p className="text-sm">{company.address}</p>
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

