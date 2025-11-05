import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import UsersGrowthReport from "./components/UsersGrowthReport";
import TopStudentsReport from "./components/TopStudentsReport";
import PopularPathsReport from "./components/PopularPathsReport";
import FlaggedContentReport from "./components/FlaggedContentReport";
import reportService from "../../services/reportService";
import { useToast } from "../../hooks/useToast";
import { TrendingUp, Award, BookOpen, AlertTriangle, RefreshCw } from "lucide-react";

export default function Reports() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("users-growth");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // Report data
  const [usersGrowthData, setUsersGrowthData] = useState(null);
  const [topStudentsData, setTopStudentsData] = useState(null);
  const [popularPathsData, setPopularPathsData] = useState(null);
  const [flaggedContentData, setFlaggedContentData] = useState(null);

  // Read report type from URL
  useEffect(() => {
    const reportType = searchParams.get('type');
    if (reportType) {
      setActiveTab(reportType);
    }
  }, [searchParams.get('type')]);

  // Fetch data for active tab
  useEffect(() => {
    fetchReportData();
  }, [activeTab]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case "users-growth":
          if (!usersGrowthData) {
            const response = await reportService.getUsersGrowth();
            setUsersGrowthData(response.data);
          }
          break;

        case "top-students":
          if (!topStudentsData) {
            const response = await reportService.getTopStudents(10);
            setTopStudentsData(response.data);
          }
          break;

        case "popular-paths":
          if (!popularPathsData) {
            const response = await reportService.getPopularPaths();
            setPopularPathsData(response.data);
          }
          break;

        case "flagged-content":
          const response = await reportService.getFlaggedContent();
          setFlaggedContentData(response.data);
          break;

        default:
          break;
      }
    } catch (error) {
      showToast("Không thể tải dữ liệu báo cáo", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    // Clear cached data and refetch
    switch (activeTab) {
      case "users-growth":
        setUsersGrowthData(null);
        break;
      case "top-students":
        setTopStudentsData(null);
        break;
      case "popular-paths":
        setPopularPathsData(null);
        break;
      case "flagged-content":
        setFlaggedContentData(null);
        break;
      default:
        break;
    }
    fetchReportData();
  };

  const handleFlaggedContentAction = async (action, item) => {
    try {
      await reportService.handleFlaggedContent(action, item.id);
      
      if (action === 'approve') {
        showToast("Đã duyệt nội dung hợp lệ", "success");
      } else if (action === 'remove') {
        showToast("Đã xóa nội dung vi phạm", "success");
      } else if (action === 'view') {
        showToast("Chức năng xem chi tiết đang phát triển", "info");
        return;
      }
      
      // Refresh flagged content list
      const response = await reportService.getFlaggedContent();
      setFlaggedContentData(response.data);
    } catch (error) {
      showToast("Không thể thực hiện hành động", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
          <p className="text-gray-500 mt-1">Xem các báo cáo và phân tích dữ liệu hệ thống</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Báo cáo chi tiết</CardTitle>
          <CardDescription>
            Chọn loại báo cáo để xem chi tiết thống kê
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="users-growth" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Tăng trưởng Users</span>
                <span className="sm:hidden">Users</span>
              </TabsTrigger>
              <TabsTrigger value="top-students" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">Top học sinh</span>
                <span className="sm:hidden">Top</span>
              </TabsTrigger>
              <TabsTrigger value="popular-paths" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Lộ trình phổ biến</span>
                <span className="sm:hidden">Paths</span>
              </TabsTrigger>
              <TabsTrigger value="flagged-content" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="hidden sm:inline">Nội dung báo cáo</span>
                <span className="sm:hidden">Flags</span>
              </TabsTrigger>
            </TabsList>

            {/* Users Growth Report */}
            <TabsContent value="users-growth">
              {loading && !usersGrowthData ? (
                <div className="text-center py-12">
                  <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-3 animate-spin" />
                  <p className="text-gray-500">Đang tải dữ liệu...</p>
                </div>
              ) : usersGrowthData ? (
                <UsersGrowthReport data={usersGrowthData} />
              ) : (
                <p className="text-center text-gray-500 py-12">Không có dữ liệu</p>
              )}
            </TabsContent>

            {/* Top Students Report */}
            <TabsContent value="top-students">
              {loading && !topStudentsData ? (
                <div className="text-center py-12">
                  <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-3 animate-spin" />
                  <p className="text-gray-500">Đang tải dữ liệu...</p>
                </div>
              ) : topStudentsData ? (
                <TopStudentsReport data={topStudentsData} />
              ) : (
                <p className="text-center text-gray-500 py-12">Không có dữ liệu</p>
              )}
            </TabsContent>

            {/* Popular Paths Report */}
            <TabsContent value="popular-paths">
              {loading && !popularPathsData ? (
                <div className="text-center py-12">
                  <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-3 animate-spin" />
                  <p className="text-gray-500">Đang tải dữ liệu...</p>
                </div>
              ) : popularPathsData ? (
                <PopularPathsReport data={popularPathsData} />
              ) : (
                <p className="text-center text-gray-500 py-12">Không có dữ liệu</p>
              )}
            </TabsContent>

            {/* Flagged Content Report */}
            <TabsContent value="flagged-content">
              {loading && !flaggedContentData ? (
                <div className="text-center py-12">
                  <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-3 animate-spin" />
                  <p className="text-gray-500">Đang tải dữ liệu...</p>
                </div>
              ) : flaggedContentData ? (
                <FlaggedContentReport 
                  data={flaggedContentData} 
                  onAction={handleFlaggedContentAction}
                />
              ) : (
                <p className="text-center text-gray-500 py-12">Không có dữ liệu</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

