import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import SearchBar from "../../components/molecules/SearchBar";
import StatusBadge from "../../components/molecules/StatusBadge";
import DataTable from "../../components/organisms/DataTable";
import CareerPathFilters from "./components/CareerPathFilters";
import CareerPathActionMenu from "./components/CareerPathActionMenu";
import CareerPathDetailModal from "./components/CareerPathDetailModal";
import AddStudentsModal from "./components/AddStudentsModal";
import careerPathService from "../../services/careerPathService";
import { useToast } from "../../hooks/useToast";
import { formatDate } from "../../utils/formatDate";
import { BookOpen, Users, Clock, Award, Plus } from "lucide-react";

export default function CareerPaths() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [careerPaths, setCareerPaths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    companyId: "ALL",
    status: "ALL",
    difficulty: "ALL"
  });

  // Modals
  const [selectedPath, setSelectedPath] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [addStudentsModalOpen, setAddStudentsModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Lessons and Students for detail modal
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);

  const { showToast } = useToast();

  // Fetch career paths
  const fetchCareerPaths = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        search: searchTerm,
        status: activeTab
      };
      const response = await careerPathService.getAll(params);
      setCareerPaths(response.data || []);
    } catch (error) {
      showToast("Không thể tải danh sách lộ trình", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareerPaths();
  }, [activeTab, filters, searchTerm]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      companyId: "ALL",
      status: "ALL",
      difficulty: "ALL"
    });
    setSearchTerm("");
  };

  const handleAction = async (action, path) => {
    setSelectedPath(path);

    switch (action) {
      case "view":
        // Load lessons and students
        try {
          const [lessonsRes, studentsRes] = await Promise.all([
            careerPathService.getLessons(path.id),
            careerPathService.getStudents(path.id)
          ]);
          setLessons(lessonsRes.data || []);
          setStudents(studentsRes.data || []);
          setDetailModalOpen(true);
        } catch (error) {
          showToast("Không thể tải chi tiết lộ trình", "error");
        }
        break;

      case "students":
        setAddStudentsModalOpen(true);
        break;

      case "lessons":
        // Load lessons
        try {
          const response = await careerPathService.getLessons(path.id);
          setLessons(response.data || []);
          setStudents([]);
          setDetailModalOpen(true);
        } catch (error) {
          showToast("Không thể tải danh sách bài học", "error");
        }
        break;

      case "approve":
        try {
          await careerPathService.approve(path.id);
          showToast("Đã phê duyệt lộ trình", "success");
          fetchCareerPaths();
        } catch (error) {
          showToast("Không thể phê duyệt lộ trình", "error");
        }
        break;

      case "reject":
        setRejectModalOpen(true);
        break;

      case "edit":
        showToast("Chức năng chỉnh sửa đang phát triển", "info");
        break;

      case "delete":
        if (window.confirm(`Xác nhận xóa lộ trình "${path.title}"?`)) {
          try {
            await careerPathService.delete(path.id);
            showToast("Đã xóa lộ trình", "success");
            fetchCareerPaths();
          } catch (error) {
            showToast("Không thể xóa lộ trình", "error");
          }
        }
        break;

      default:
        break;
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      showToast("Vui lòng nhập lý do từ chối", "error");
      return;
    }

    try {
      await careerPathService.reject(selectedPath.id, rejectReason);
      showToast("Đã từ chối lộ trình", "success");
      setRejectModalOpen(false);
      setRejectReason("");
      fetchCareerPaths();
    } catch (error) {
      showToast("Không thể từ chối lộ trình", "error");
    }
  };

  const handleAddStudents = async (students) => {
    const studentIds = students.map(s => s.id);
    try {
      await careerPathService.addStudents(selectedPath.id, studentIds);
      // Refresh would happen via the modal's callback
    } catch (error) {
      showToast("Không thể thêm học viên", "error");
    }
  };

  // Table columns
  const columns = [
    {
      key: "title",
      label: "Tên lộ trình",
      render: (path) => (
        <div>
          <p className="font-medium text-gray-900">{path.title}</p>
          <p className="text-sm text-gray-500">{path.companyName}</p>
        </div>
      )
    },
    {
      key: "difficulty",
      label: "Cấp độ",
      render: (path) => {
        const colors = {
          BEGINNER: "bg-green-100 text-green-800",
          INTERMEDIATE: "bg-yellow-100 text-yellow-800",
          ADVANCED: "bg-red-100 text-red-800"
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[path.difficulty]}`}>
            {path.difficulty}
          </span>
        );
      }
    },
    {
      key: "stats",
      label: "Thống kê",
      render: (path) => (
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center text-gray-600">
            <BookOpen className="h-4 w-4 mr-1" />
            {path.totalLessons}
          </span>
          <span className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-1" />
            {path.studentsCount}
          </span>
        </div>
      )
    },
    {
      key: "duration",
      label: "Thời lượng",
      render: (path) => (
        <div className="flex items-center text-gray-600">
          <Clock className="h-4 w-4 mr-1" />
          {path.duration}
        </div>
      )
    },
    {
      key: "completionRate",
      label: "Hoàn thành",
      render: (path) => (
        path.completionRate > 0 ? (
          <div className="flex items-center">
            <Award className="h-4 w-4 mr-1 text-purple-600" />
            <span className="font-medium">{path.completionRate}%</span>
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )
      )
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (path) => <StatusBadge status={path.status} />
    },
    {
      key: "createdAt",
      label: "Ngày tạo",
      render: (path) => (
        <span className="text-sm text-gray-600">{formatDate(path.createdAt)}</span>
      )
    },
    {
      key: "actions",
      label: "",
      render: (path) => (
        <CareerPathActionMenu careerPath={path} onAction={handleAction} />
      )
    }
  ];

  // Calculate counts for tabs
  const allCount = careerPaths.length;
  const pendingCount = careerPaths.filter(p => p.status === "PENDING").length;
  const approvedCount = careerPaths.filter(p => p.status === "APPROVED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý lộ trình</h1>
          <p className="text-gray-500 mt-1">Quản lý các lộ trình nghề nghiệp và nội dung học tập</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tạo lộ trình mới
        </Button>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách lộ trình</CardTitle>
          <CardDescription>
            Xem và quản lý tất cả các lộ trình nghề nghiệp từ các doanh nghiệp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="ALL">
                Tất cả ({allCount})
              </TabsTrigger>
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
                    placeholder="Tìm kiếm lộ trình..."
                  />
                </div>
              </div>

              <CareerPathFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />

              {/* Table */}
              <TabsContent value={activeTab} className="mt-0">
                <DataTable
                  columns={columns}
                  data={careerPaths}
                  loading={loading}
                  emptyMessage="Không có lộ trình nào"
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <CareerPathDetailModal
        careerPath={selectedPath}
        lessons={lessons}
        students={students}
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedPath(null);
          setLessons([]);
          setStudents([]);
        }}
      />

      {/* Add Students Modal */}
      <AddStudentsModal
        careerPath={selectedPath}
        open={addStudentsModalOpen}
        onClose={() => {
          setAddStudentsModalOpen(false);
          setSelectedPath(null);
        }}
        onAdd={handleAddStudents}
      />

      {/* Reject Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối lộ trình</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Lộ trình: <span className="font-medium">{selectedPath?.title}</span>
              </p>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Lý do từ chối *
              </label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Nhập lý do từ chối lộ trình này..."
                rows={4}
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectModalOpen(false);
                setRejectReason("");
              }}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleRejectSubmit}>
              Từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

