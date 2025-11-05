import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/templates/DashboardLayout';
import StatCard from '../../components/molecules/StatCard';
import UsersGrowthChart from './components/UsersGrowthChart';
import ActivityTimeline from './components/ActivityTimeline';
import {
  Users,
  Building2,
  Route,
  FileText,
  AlertCircle
} from 'lucide-react';
import statisticsService from '../../services/statisticsService';
import { mockDashboardStats, mockUsersGrowthData, mockActivities } from '../../utils/mockData';
import { useToast } from '../../hooks/useToast';

/**
 * Dashboard Page - Main admin dashboard with statistics and charts
 */
export default function Dashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [growthData, setGrowthData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // TODO: Replace with real API calls when backend is ready
      // For now, using mock data with simulated delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock API calls
      // const statsData = await statisticsService.getOverview();
      // const growthData = await statisticsService.getUsersGrowth(6);
      // const activitiesData = await statisticsService.getActivities(10);

      // Using mock data
      setStats(mockDashboardStats);
      setGrowthData(mockUsersGrowthData);
      setActivities(mockActivities);

    } catch (error) {
      toast.error('Không thể tải dữ liệu dashboard');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Không thể tải dữ liệu</p>
            <button 
              onClick={fetchDashboardData}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Thử lại
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pendingCounts={stats.pendingApprovals}>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Tổng quan về hệ thống
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Tổng Users"
            value={stats.totalUsers.toLocaleString()}
            description={`${stats.totalStudents} Students, ${stats.totalCompanies} Companies`}
            icon={Users}
            trend={{
              value: stats.growth.users.value,
              direction: stats.growth.users.trend
            }}
          />

          <StatCard
            title="Students"
            value={stats.totalStudents.toLocaleString()}
            description="Sinh viên đang hoạt động"
            icon={Users}
            trend={{
              value: stats.growth.users.value,
              direction: stats.growth.users.trend
            }}
          />

          <StatCard
            title="Companies"
            value={stats.totalCompanies}
            description={`${stats.pendingApprovals.companies} chờ duyệt`}
            icon={Building2}
            trend={{
              value: stats.growth.companies?.value || 0,
              direction: stats.growth.companies?.trend || 'up'
            }}
          />

          <StatCard
            title="Career Paths"
            value={stats.activeGroups}
            description="Lộ trình đang hoạt động"
            icon={Route}
          />

          <StatCard
            title="Blogs"
            value={stats.totalBlogs}
            description={`${stats.pendingApprovals.blogs} chờ duyệt`}
            icon={FileText}
          />

          <StatCard
            title="Chờ phê duyệt"
            value={stats.pendingApprovals.companies + stats.pendingApprovals.blogs}
            description={`${stats.pendingApprovals.companies} companies, ${stats.pendingApprovals.blogs} blogs`}
            icon={AlertCircle}
            className="md:col-span-2 lg:col-span-1"
          />
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Users Growth Chart - Takes 2 columns */}
          <div className="lg:col-span-2">
            <UsersGrowthChart data={growthData} />
          </div>

          {/* Activity Timeline - Takes 1 column */}
          <div className="lg:col-span-1">
            <ActivityTimeline activities={activities} />
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-card border rounded-lg">
            <h3 className="font-semibold mb-2">Tỷ lệ active</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Students</span>
                <span className="font-medium">
                  {((stats.totalStudents / stats.totalUsers) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary"
                  style={{ width: `${(stats.totalStudents / stats.totalUsers) * 100}%` }}
                />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Companies</span>
                <span className="font-medium">
                  {((stats.totalCompanies / stats.totalUsers) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500"
                  style={{ width: `${(stats.totalCompanies / stats.totalUsers) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-card border rounded-lg">
            <h3 className="font-semibold mb-2">Thống kê nhanh</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Admins</span>
                <span className="font-medium">{stats.totalAdmins}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Career Paths</span>
                <span className="font-medium">{stats.activeGroups}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Blogs</span>
                <span className="font-medium">{stats.totalBlogs}</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-card border rounded-lg">
            <h3 className="font-semibold mb-2 text-orange-600">Cần xử lý</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Companies chờ duyệt</span>
                <span className="font-medium text-orange-600">
                  {stats.pendingApprovals.companies}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Blogs chờ duyệt</span>
                <span className="font-medium text-orange-600">
                  {stats.pendingApprovals.blogs}
                </span>
              </div>
              <button className="w-full mt-2 text-sm text-primary hover:underline text-left">
                Xem tất cả →
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

