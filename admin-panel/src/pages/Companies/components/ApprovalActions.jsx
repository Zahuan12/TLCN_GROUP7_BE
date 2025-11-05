import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Textarea } from '../../../components/ui/textarea';
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';

/**
 * ApprovalActions - Approve/Reject buttons with reason dialog
 */
export default function ApprovalActions({ company, onApprove, onReject }) {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!confirm(`Xác nhận phê duyệt công ty "${company.companyName}"?`)) {
      return;
    }

    setLoading(true);
    try {
      await onApprove(company);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối');
      return;
    }

    setLoading(true);
    try {
      await onReject(company, rejectReason);
      setShowRejectDialog(false);
      setRejectReason('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={handleApprove}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700"
        >
          <CheckCircleIcon className="w-4 h-4 mr-2" />
          Phê duyệt
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowRejectDialog(true)}
          disabled={loading}
        >
          <XCircleIcon className="w-4 h-4 mr-2" />
          Từ chối
        </Button>
      </div>

      {/* Reject Reason Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối công ty</DialogTitle>
            <DialogDescription>
              Nhập lý do từ chối công ty "{company.companyName}"
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Lý do từ chối *</label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ví dụ: Giấy phép kinh doanh không hợp lệ, thông tin không chính xác..."
                rows={4}
                className="mt-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={loading || !rejectReason.trim()}
            >
              {loading ? 'Đang xử lý...' : 'Xác nhận từ chối'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

