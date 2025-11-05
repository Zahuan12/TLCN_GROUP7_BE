import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { AlertTriangle, Eye, CheckCircle, XCircle, FileText, MessageSquare } from "lucide-react";
import { formatDate } from "../../../utils/formatDate";

export default function FlaggedContentReport({ data, onAction }) {
  if (!data || !data.flaggedItems) return null;

  const getSeverityColor = (severity) => {
    const colors = {
      HIGH: "bg-red-100 text-red-800 border-red-300",
      MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-300",
      LOW: "bg-blue-100 text-blue-800 border-blue-300"
    };
    return colors[severity] || "bg-gray-100 text-gray-800";
  };

  const getTypeIcon = (type) => {
    if (type === 'BLOG') return <FileText className="h-5 w-5" />;
    if (type === 'COMMENT') return <MessageSquare className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Cần xử lý gấp</p>
                <p className="text-2xl font-bold text-red-700 mt-1">{data.highPriority || 0}</p>
              </div>
              <div className="w-12 h-12 bg-red-200 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng báo cáo</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{data.total || 0}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Đã xử lý</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{data.resolved || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Chờ xử lý</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{data.pending || 0}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flagged Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách nội dung bị báo cáo</CardTitle>
          <CardDescription>
            Các nội dung được cộng đồng báo cáo vi phạm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.flaggedItems.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-500">Không có nội dung bị báo cáo</p>
              </div>
            ) : (
              data.flaggedItems.map((item) => (
                <Card key={item.id} className={`${
                  item.severity === 'HIGH' ? 'border-red-300 bg-red-50' :
                  item.severity === 'MEDIUM' ? 'border-yellow-300 bg-yellow-50' :
                  'border-blue-300'
                }`}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {/* Type Icon */}
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            item.type === 'BLOG' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                          }`}>
                            {getTypeIcon(item.type)}
                          </div>

                          {/* Content Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{item.title}</h4>
                              <Badge variant="outline">{item.type}</Badge>
                              <Badge className={getSeverityColor(item.severity)}>
                                {item.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{item.content}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>Tác giả: {item.author}</span>
                              <span>•</span>
                              <span>Ngày tạo: {formatDate(item.createdDate)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="text-right ml-4">
                          {item.status === 'PENDING' ? (
                            <Badge variant="secondary">Chờ xử lý</Badge>
                          ) : item.status === 'RESOLVED' ? (
                            <Badge className="bg-green-100 text-green-800">Đã xử lý</Badge>
                          ) : (
                            <Badge variant="outline">Đã từ chối</Badge>
                          )}
                        </div>
                      </div>

                      {/* Report Details */}
                      <div className="p-3 bg-white rounded-lg border">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          <AlertTriangle className="h-4 w-4 inline mr-1 text-red-500" />
                          Lý do báo cáo:
                        </p>
                        <p className="text-sm text-gray-600">{item.reportReason}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{item.reportCount} lượt báo cáo</span>
                          <span>•</span>
                          <span>Người báo cáo đầu tiên: {item.reporter}</span>
                          <span>•</span>
                          <span>{formatDate(item.reportedDate)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      {item.status === 'PENDING' && (
                        <div className="flex items-center gap-2 pt-2 border-t">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onAction('view', item)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Xem chi tiết
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => onAction('approve', item)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Hợp lệ
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onAction('remove', item)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Xóa nội dung
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Guidelines */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Hướng dẫn xử lý</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• <strong>HIGH (Cao):</strong> Vi phạm nghiêm trọng (spam, lừa đảo, nội dung độc hại) - Cần xóa ngay</p>
            <p>• <strong>MEDIUM (Trung bình):</strong> Vi phạm quy định (sai sự thật, không phù hợp) - Xem xét kỹ</p>
            <p>• <strong>LOW (Thấp):</strong> Báo cáo nhầm hoặc vi phạm nhỏ - Có thể giữ lại</p>
            <p className="mt-3 pt-3 border-t border-blue-300">
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              Lưu ý: Hãy xem xét kỹ trước khi xóa nội dung. Ưu tiên xử lý các báo cáo có mức độ HIGH trước.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

