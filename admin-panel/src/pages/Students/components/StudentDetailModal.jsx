import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Card, CardContent } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";
import { formatDate } from "../../../utils/formatDate";
import { 
  GraduationCap, Mail, Phone, MapPin, Calendar, 
  BookOpen, Award, TrendingUp, CheckCircle2 
} from "lucide-react";

export default function StudentDetailModal({ 
  student, 
  enrolledPaths = [], 
  testResults = [], 
  open, 
  onClose 
}) {
  if (!student) return null;

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: "bg-green-100 text-green-800",
      COMPLETED: "bg-blue-100 text-blue-800",
      INACTIVE: "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getTestScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Thông tin sinh viên</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-start gap-4 pb-4 border-b">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold text-3xl">
              {student.fullName.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-gray-900">{student.fullName}</h3>
                <Badge className={getStatusColor(student.learningStatus)}>
                  {student.learningStatus}
                </Badge>
              </div>
              <p className="text-gray-600 mb-1">{student.studentCode}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  {student.university}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Khóa {student.enrollmentYear}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{student.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{student.phone || "Chưa cập nhật"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm col-span-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{student.address || "Chưa cập nhật"}</span>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{student.enrolledPathsCount || 0}</p>
                  <p className="text-sm text-gray-500">Lộ trình</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{student.completedLessons || 0}</p>
                  <p className="text-sm text-gray-500">Bài học</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{student.avgScore || 0}</p>
                  <p className="text-sm text-gray-500">Điểm TB</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{student.overallProgress || 0}%</p>
                  <p className="text-sm text-gray-500">Tiến độ</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="paths" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="paths">
                <BookOpen className="h-4 w-4 mr-2" />
                Lộ trình ({enrolledPaths.length})
              </TabsTrigger>
              <TabsTrigger value="tests">
                <Award className="h-4 w-4 mr-2" />
                Bài test ({testResults.length})
              </TabsTrigger>
            </TabsList>

            {/* Enrolled Paths */}
            <TabsContent value="paths" className="space-y-3 mt-4">
              {enrolledPaths.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Chưa tham gia lộ trình nào</p>
              ) : (
                enrolledPaths.map((path) => (
                  <Card key={path.id}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{path.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{path.companyName}</p>
                          </div>
                          <Badge variant={path.progress === 100 ? "success" : "secondary"}>
                            {path.progress === 100 ? "Hoàn thành" : "Đang học"}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Tiến độ</span>
                            <span className="font-medium">{path.progress}%</span>
                          </div>
                          <Progress value={path.progress} className="h-2" />
                          <p className="text-xs text-gray-500">
                            {path.completedLessons}/{path.totalLessons} bài học • 
                            Tham gia: {formatDate(path.enrolledDate)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Test Results */}
            <TabsContent value="tests" className="space-y-3 mt-4">
              {testResults.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Chưa có kết quả bài test nào</p>
              ) : (
                testResults.map((test) => (
                  <Card key={test.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{test.testName}</h4>
                          <p className="text-sm text-gray-600 mt-1">{test.careerPath}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>{formatDate(test.completedDate)}</span>
                            <span>Thời gian: {test.duration}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-3xl font-bold ${getTestScoreColor(test.score)}`}>
                            {test.score}
                          </p>
                          <p className="text-sm text-gray-500">điểm</p>
                          {test.rank && (
                            <Badge variant="outline" className="mt-2">
                              Top {test.rank}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

