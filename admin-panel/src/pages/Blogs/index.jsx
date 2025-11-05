import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import SearchBar from "../../components/molecules/SearchBar";
import StatusBadge from "../../components/molecules/StatusBadge";
import DataTable from "../../components/organisms/DataTable";
import BlogFilters from "./components/BlogFilters";
import BlogActionMenu from "./components/BlogActionMenu";
import BlogDetailModal from "./components/BlogDetailModal";
import blogService from "../../services/blogService";
import { useToast } from "../../hooks/useToast";
import { formatDate } from "../../utils/formatDate";
import { Eye, Heart, MessageSquare, FileText } from "lucide-react";

export default function Blogs() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("PENDING");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "ALL",
    authorRole: "ALL"
  });

  // Modals
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [warnUser, setWarnUser] = useState(true);

  // Comments for detail modal
  const [comments, setComments] = useState([]);

  const { showToast } = useToast();

  // Read status from URL query params and update activeTab
  useEffect(() => {
    const statusFromUrl = searchParams.get('status');
    if (statusFromUrl) {
      const tabValue = statusFromUrl.toUpperCase();
      if (['PENDING', 'APPROVED'].includes(tabValue)) {
        setActiveTab(tabValue);
      }
    }
  }, [searchParams.get('status')]);

  // Fetch blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        search: searchTerm,
        status: activeTab
      };
      const response = await blogService.getAll(params);
      setBlogs(response.data || []);
    } catch (error) {
      showToast("Không thể tải danh sách blog", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [activeTab, filters, searchTerm]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: "ALL",
      authorRole: "ALL"
    });
    setSearchTerm("");
  };

  const handleAction = async (action, blog) => {
    setSelectedBlog(blog);

    switch (action) {
      case "view":
      case "comments":
        // Load blog and comments
        try {
          const [blogRes, commentsRes] = await Promise.all([
            blogService.getById(blog.id),
            blogService.getComments(blog.id)
          ]);
          setSelectedBlog(blogRes.data);
          setComments(commentsRes.data || []);
          setDetailModalOpen(true);
        } catch (error) {
          showToast("Không thể tải chi tiết blog", "error");
        }
        break;

      case "approve":
        try {
          await blogService.approve(blog.id);
          showToast("Đã phê duyệt blog", "success");
          fetchBlogs();
        } catch (error) {
          showToast("Không thể phê duyệt blog", "error");
        }
        break;

      case "reject":
        setRejectModalOpen(true);
        break;

      case "delete":
        if (window.confirm(`Xác nhận xóa blog "${blog.title}"?`)) {
          try {
            await blogService.delete(blog.id);
            showToast("Đã xóa blog", "success");
            fetchBlogs();
          } catch (error) {
            showToast("Không thể xóa blog", "error");
          }
        }
        break;

      default:
        break;
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      showToast("Vui lòng nhập lý do vi phạm", "error");
      return;
    }

    try {
      await blogService.reject(selectedBlog.id, rejectReason, warnUser);
      showToast(
        warnUser 
          ? "Đã từ chối blog và cảnh báo tác giả" 
          : "Đã từ chối blog", 
        "success"
      );
      setRejectModalOpen(false);
      setRejectReason("");
      setWarnUser(true);
      fetchBlogs();
    } catch (error) {
      showToast("Không thể từ chối blog", "error");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Xác nhận xóa bình luận này?")) {
      try {
        await blogService.deleteComment(commentId);
        showToast("Đã xóa bình luận", "success");
        // Reload comments
        const commentsRes = await blogService.getComments(selectedBlog.id);
        setComments(commentsRes.data || []);
      } catch (error) {
        showToast("Không thể xóa bình luận", "error");
      }
    }
  };

  // Table columns
  const columns = [
    {
      key: "title",
      label: "Tiêu đề",
      render: (blog) => (
        <div className="max-w-md">
          <p className="font-medium text-gray-900 line-clamp-2">{blog.title}</p>
          <p className="text-sm text-gray-500 mt-1">{blog.category}</p>
        </div>
      )
    },
    {
      key: "author",
      label: "Tác giả",
      render: (blog) => (
        <div>
          <p className="font-medium text-gray-900">{blog.author.fullName}</p>
          <p className="text-xs text-gray-500">{blog.author.role}</p>
        </div>
      )
    },
    {
      key: "stats",
      label: "Thống kê",
      render: (blog) => (
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center text-gray-600">
            <Eye className="h-4 w-4 mr-1" />
            {blog.stats?.views || 0}
          </span>
          <span className="flex items-center text-gray-600">
            <Heart className="h-4 w-4 mr-1" />
            {blog.stats?.likes || 0}
          </span>
          <span className="flex items-center text-gray-600">
            <MessageSquare className="h-4 w-4 mr-1" />
            {blog.stats?.comments || 0}
          </span>
        </div>
      )
    },
    {
      key: "createdDate",
      label: "Ngày tạo",
      render: (blog) => (
        <span className="text-sm text-gray-600">{formatDate(blog.createdDate)}</span>
      )
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (blog) => <StatusBadge status={blog.status} />
    },
    {
      key: "actions",
      label: "",
      render: (blog) => (
        <BlogActionMenu blog={blog} onAction={handleAction} />
      )
    }
  ];

  // Calculate counts for tabs
  const pendingCount = blogs.filter(b => b.status === "PENDING").length;
  const approvedCount = blogs.filter(b => b.status === "APPROVED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Blogs</h1>
          <p className="text-gray-500 mt-1">Kiểm duyệt và quản lý nội dung blog từ cộng đồng</p>
        </div>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Tạo blog mới
        </Button>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách blogs</CardTitle>
          <CardDescription>
            Xem và kiểm duyệt các bài viết blog từ sinh viên và doanh nghiệp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="PENDING">
                Chờ duyệt ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="APPROVED">
                Đã duyệt ({approvedCount})
              </TabsTrigger>
            </TabsList>

            <div className="space-y-4">
              {/* Search and Filters */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Tìm kiếm blog..."
                  />
                </div>
              </div>

              <BlogFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />

              {/* Table */}
              <TabsContent value={activeTab} className="mt-0">
                <DataTable
                  columns={columns}
                  data={blogs}
                  loading={loading}
                  emptyMessage={
                    activeTab === "PENDING" 
                      ? "Không có blog nào chờ duyệt" 
                      : "Không có blog nào đã duyệt"
                  }
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <BlogDetailModal
        blog={selectedBlog}
        comments={comments}
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedBlog(null);
          setComments([]);
        }}
        onDeleteComment={handleDeleteComment}
      />

      {/* Reject Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối blog - Vi phạm nội dung</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Blog: <span className="font-medium">{selectedBlog?.title}</span>
              </p>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Lý do vi phạm *
              </label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Nhập lý do từ chối blog này (spam, nội dung không phù hợp, sai sự thật, ...)"
                rows={4}
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="warn-user"
                checked={warnUser}
                onCheckedChange={setWarnUser}
              />
              <Label
                htmlFor="warn-user"
                className="text-sm text-gray-700 cursor-pointer"
              >
                Gửi cảnh báo cho tác giả
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectModalOpen(false);
                setRejectReason("");
                setWarnUser(true);
              }}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleRejectSubmit}>
              Vi phạm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

