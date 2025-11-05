import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Building2 } from "lucide-react";

export default function UsersGrowthReport({ data }) {
  if (!data || !data.chartData) return null;

  const totalUsers = data.totalUsers || 0;
  const totalStudents = data.totalStudents || 0;
  const totalCompanies = data.totalCompanies || 0;
  const growthRate = data.growthRate || 0;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalUsers}</p>
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
                <p className="text-sm text-gray-500">Sinh viên</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Doanh nghiệp</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalCompanies}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tăng trưởng</p>
                <p className="text-2xl font-bold text-green-600 mt-1">+{growthRate}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Biểu đồ tăng trưởng Users</CardTitle>
          <CardDescription>
            Số lượng users mới theo tháng trong 6 tháng gần đây
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="students" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Sinh viên"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="companies" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="Doanh nghiệp"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Tổng"
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Phân tích</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              • Tổng số users hiện tại: <strong>{totalUsers}</strong> (Sinh viên: {totalStudents}, Doanh nghiệp: {totalCompanies})
            </p>
            <p>
              • Tăng trưởng trung bình: <strong className="text-green-600">+{growthRate}%</strong> so với tháng trước
            </p>
            <p>
              • Xu hướng: Số lượng sinh viên đăng ký tăng đều đặn, đặc biệt cao vào đầu tháng 10 (mùa tuyển sinh)
            </p>
            <p>
              • Doanh nghiệp: Tốc độ tăng trưởng ổn định, cho thấy nền tảng đang được nhiều công ty tin tưởng
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

