import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Award, BookOpen } from "lucide-react";

export default function PopularPathsReport({ data }) {
  if (!data || !data.paths) return null;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng lộ trình</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{data.totalPaths || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng học viên</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{data.totalEnrollments || 0}</p>
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
                <p className="text-sm text-gray-500">Hoàn thành TB</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{data.avgCompletionRate || 0}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Phổ biến nhất</p>
                <p className="text-lg font-bold text-gray-900 mt-1 line-clamp-1">
                  {data.mostPopular || "N/A"}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Biểu đồ độ phổ biến</CardTitle>
          <CardDescription>
            Số lượng học viên đăng ký theo từng lộ trình
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11 }}
                angle={-15}
                textAnchor="end"
                height={100}
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
              <Bar 
                dataKey="enrollments" 
                fill="#3b82f6" 
                name="Số học viên"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed List */}
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết lộ trình</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.paths.map((path, index) => (
              <div 
                key={path.id}
                className="p-4 rounded-lg border bg-white hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  {/* Left: Path Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{path.title}</h4>
                        {index === 0 && <Badge className="bg-yellow-500">🔥 Phổ biến nhất</Badge>}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{path.companyName}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Cấp độ: <Badge variant="outline">{path.difficulty}</Badge></span>
                        <span>Thời lượng: {path.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Stats */}
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="text-sm text-gray-500">Học viên</p>
                      <p className="text-xl font-bold text-blue-600">{path.enrollments}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bài học</p>
                      <p className="text-xl font-bold text-gray-900">{path.lessons}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hoàn thành</p>
                      <p className="text-xl font-bold text-green-600">{path.completionRate}%</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Phân tích & Xu hướng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              • <strong>{data.mostPopular}</strong> là lộ trình phổ biến nhất với {data.paths[0]?.enrollments} học viên
            </p>
            <p>
              • Tỷ lệ hoàn thành trung bình: <strong className="text-green-600">{data.avgCompletionRate}%</strong>
            </p>
            <p>
              • Lộ trình về <strong>Backend & Frontend Development</strong> được ưa chuộng nhất
            </p>
            <p>
              • Lộ trình cấp độ <Badge variant="outline">INTERMEDIATE</Badge> có số lượng đăng ký cao nhất
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

