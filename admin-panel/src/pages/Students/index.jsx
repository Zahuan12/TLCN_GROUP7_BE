import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import SearchBar from "../../components/molecules/SearchBar";
import DataTable from "../../components/organisms/DataTable";
import StudentFilters from "./components/StudentFilters";
import StudentActionMenu from "./components/StudentActionMenu";
import StudentDetailModal from "./components/StudentDetailModal";
import StudentProgressModal from "./components/StudentProgressModal";
import studentService from "../../services/studentService";
import { useToast } from "../../hooks/useToast";
import { formatDate } from "../../utils/formatDate";
import { Users, GraduationCap, TrendingUp, Award, UserPlus } from "lucide-react";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    careerPath: "ALL",
    status: "ALL",
    university: "ALL"
  });

  // Modals
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  
  // Data for modals
  const [enrolledPaths, setEnrolledPaths] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [progressData, setProgressData] = useState(null);

  const { showToast } = useToast();

  // Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        search: searchTerm
      };
      const response = await studentService.getAll(params);
      setStudents(response.data || []);
    } catch (error) {
      showToast("Không thể tải danh sách sinh viên", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [filters, searchTerm]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      careerPath: "ALL",
      status: "ALL",
      university: "ALL"
    });
    setSearchTerm("");
  };

  const handleAction = async (action, student) => {
    setSelectedStudent(student);

    switch (action) {
      case "view":
        // Load student details
        try {
          const [pathsRes, testsRes] = await Promise.all([
            studentService.getEnrolledPaths(student.userId),
            studentService.getTestResults(student.userId)
          ]);
          setEnrolledPaths(pathsRes.data || []);
          setTestResults(testsRes.data || []);
          setDetailModalOpen(true);
        } catch (error) {
          showToast("Không thể tải thông tin sinh viên", "error");
        }
        break;

      case "progress":
        // Show progress for first enrolled path
        try {
          const pathsRes = await studentService.getEnrolledPaths(student.userId);
          const paths = pathsRes.data || [];
          if (paths.length > 0) {
            const progressRes = await studentService.getPathProgress(
              student.userId,
              paths[0].id
            );
            setProgressData({
              student,
              careerPath: paths[0],
              lessons: progressRes.data.lessons || []
            });
            setProgressModalOpen(true);
          } else {
            showToast("Sinh viên chưa tham gia lộ trình nào", "info");
          }
        } catch (error) {
          showToast("Không thể tải tiến độ học tập", "error");
        }
        break;

      case "tests":
        // Load test results
        try {
          const testsRes = await studentService.getTestResults(student.userId);
          setTestResults(testsRes.data || []);
          setEnrolledPaths([]);
          setDetailModalOpen(true);
        } catch (error) {
          showToast("Không thể tải kết quả bài test", "error");
        }
        break;

      case "achievements":
        showToast("Chức năng thành tích đang phát triển", "info");
        break;

      case "edit":
        showToast("Chức năng chỉnh sửa đang phát triển", "info");
        break;

      case "suspend":
        if (window.confirm(`Xác nhận tạm khóa tài khoản "${student.fullName}"?`)) {
          try {
            await studentService.suspend(student.userId, "Vi phạm quy định");
            showToast("Đã tạm khóa tài khoản sinh viên", "success");
            fetchStudents();
          } catch (error) {
            showToast("Không thể tạm khóa tài khoản", "error");
          }
        }
        break;

      default:
        break;
    }
  };

  // Table columns
  const columns = [
    {
      key: "student",
      label: "Sinh viên",
      render: (student) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold">
            {student.fullName.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-900">{student.fullName}</p>
            <p className="text-sm text-gray-500">{student.studentCode}</p>
          </div>
        </div>
      )
    },
    {
      key: "university",
      label: "Trường",
      render: (student) => (
        <div>
          <p className="text-sm text-gray-900">{student.university}</p>
          <p className="text-xs text-gray-500">Khóa {student.enrollmentYear}</p>
        </div>
      )
    },
    {
      key: "progress",
      label: "Tiến độ",
      render: (student) => (
        <div className="w-32">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Tổng thể</span>
            <span className="text-xs font-medium">{student.overallProgress}%</span>
          </div>
          <Progress value={student.overallProgress} className="h-1.5" />
        </div>
      )
    },
    {
      key: "stats",
      label: "Thống kê",
      render: (student) => (
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center text-blue-600">
            <GraduationCap className="h-4 w-4 mr-1" />
            <span className="font-medium">{student.enrolledPathsCount}</span>
          </div>
          <div className="flex items-center text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="font-medium">{student.completedLessons}</span>
          </div>
          <div className="flex items-center text-purple-600">
            <Award className="h-4 w-4 mr-1" />
            <span className="font-medium">{student.avgScore}</span>
          </div>
        </div>
      )
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (student) => {
        const statusColors = {
          ACTIVE: "bg-green-100 text-green-800",
          COMPLETED: "bg-blue-100 text-blue-800",
          INACTIVE: "bg-gray-100 text-gray-800"
        };
        const statusLabels = {
          ACTIVE: "Đang học",
          COMPLETED: "Hoàn thành",
          INACTIVE: "Không hoạt động"
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[student.learningStatus]}`}>
            {statusLabels[student.learningStatus]}
          </span>
        );
      }
    },
    {
      key: "lastLogin",
      label: "Hoạt động cuối",
      render: (student) => (
        <span className="text-sm text-gray-600">{formatDate(student.lastLogin)}</span>
      )
    },
    {
      key: "actions",
      label: "",
      render: (student) => (
        <StudentActionMenu student={student} onAction={handleAction} />
      )
    }
  ];

  // Calculate statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.learningStatus === 'ACTIVE').length;
  const avgProgress = students.length > 0 
    ? Math.round(students.reduce((sum, s) => sum + s.overallProgress, 0) / students.length)
    : 0;
  const avgScore = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + s.avgScore, 0) / students.length * 10) / 10
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Sinh viên</h1>
          <p className="text-gray-500 mt-1">Theo dõi tiến độ học tập và thành tích của sinh viên</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Thêm sinh viên
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng sinh viên</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Đang hoạt động</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{activeStudents}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tiến độ TB</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{avgProgress}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Điểm TB</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{avgScore}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sinh viên</CardTitle>
          <CardDescription>
            Quản lý và theo dõi tiến độ học tập của tất cả sinh viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Tìm kiếm sinh viên..."
                />
              </div>
            </div>

            <StudentFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />

            {/* Table */}
            <DataTable
              columns={columns}
              data={students}
              loading={loading}
              emptyMessage="Không có sinh viên nào"
            />
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <StudentDetailModal
        student={selectedStudent}
        enrolledPaths={enrolledPaths}
        testResults={testResults}
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedStudent(null);
          setEnrolledPaths([]);
          setTestResults([]);
        }}
      />

      {/* Progress Modal */}
      {progressData && (
        <StudentProgressModal
          student={progressData.student}
          careerPath={progressData.careerPath}
          lessons={progressData.lessons}
          open={progressModalOpen}
          onClose={() => {
            setProgressModalOpen(false);
            setProgressData(null);
          }}
        />
      )}
    </div>
  );
}

