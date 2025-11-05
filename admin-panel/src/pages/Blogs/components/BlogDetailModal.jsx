import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Card, CardContent } from "../../../components/ui/card";
import StatusBadge from "../../../components/molecules/StatusBadge";
import { formatDate } from "../../../utils/formatDate";
import { Eye, Heart, MessageSquare, User, Trash2, Calendar } from "lucide-react";

export default function BlogDetailModal({ blog, comments = [], open, onClose, onDeleteComment }) {
  if (!blog) return null;

  const getRoleBadgeColor = (role) => {
    const colors = {
      STUDENT: "bg-blue-100 text-blue-800",
      COMPANY: "bg-purple-100 text-purple-800",
      ADMIN: "bg-red-100 text-red-800"
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between pr-8">
            <span>{blog.title}</span>
            <StatusBadge status={blog.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Author & Meta Info */}
          <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold text-lg">
                {blog.author.fullName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{blog.author.fullName}</p>
                <div className="flex items-center gap-2">
                  <Badge className={getRoleBadgeColor(blog.author.role)} variant="secondary">
                    {blog.author.role}
                  </Badge>
                  <span className="text-sm text-gray-500">• {blog.category}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {blog.stats?.views || 0}
              </span>
              <span className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                {blog.stats?.likes || 0}
              </span>
              <span className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                {blog.stats?.comments || 0}
              </span>
            </div>
          </div>

          {/* Image */}
          {blog.imageUrl && (
            <div className="rounded-lg overflow-hidden">
              <img 
                src={blog.imageUrl} 
                alt={blog.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Nội dung</h3>
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {blog.content}
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-gray-500">Ngày tạo</p>
              <p className="font-medium flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                {formatDate(blog.createdDate)}
              </p>
            </div>
            {blog.approvedDate && (
              <div>
                <p className="text-sm text-gray-500">Ngày duyệt</p>
                <p className="font-medium flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  {formatDate(blog.approvedDate)}
                </p>
              </div>
            )}
          </div>

          {/* Comments Section (if approved) */}
          {blog.status === "APPROVED" && (
            <div className="pt-4 border-t">
              <Tabs defaultValue="comments" className="w-full">
                <TabsList>
                  <TabsTrigger value="comments">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Bình luận ({comments.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="comments" className="space-y-3 mt-4">
                  {comments.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Chưa có bình luận nào</p>
                  ) : (
                    comments.map((comment) => (
                      <Card key={comment.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start flex-1">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center text-white font-semibold text-sm mr-3">
                                {comment.author.fullName.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-gray-900">{comment.author.fullName}</span>
                                  <span className="text-xs text-gray-500">{formatDate(comment.createdDate)}</span>
                                </div>
                                <p className="text-gray-700">{comment.content}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteComment(comment.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

