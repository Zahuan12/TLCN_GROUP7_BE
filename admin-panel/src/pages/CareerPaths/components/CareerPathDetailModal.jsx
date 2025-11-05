import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import StatusBadge from "../../../components/molecules/StatusBadge";
import { formatDate } from "../../../utils/formatDate";
import { BookOpen, Users, Clock, Award, CheckCircle2, Play } from "lucide-react";

export default function CareerPathDetailModal({ careerPath, lessons = [], students = [], open, onClose }) {
  if (!careerPath) return null;

  const getDifficultyColor = (difficulty) => {
    const colors = {
      BEGINNER: "bg-green-100 text-green-800",
      INTERMEDIATE: "bg-yellow-100 text-yellow-800",
      ADVANCED: "bg-red-100 text-red-800"
    };
    return colors[difficulty] || "bg-gray-100 text-gray-800";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center justify-between">
            <span>{careerPath.title}</span>
            <StatusBadge status={careerPath.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Công ty</p>
              <p className="font-medium">{careerPath.companyName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cấp độ</p>
              <Badge className={getDifficultyColor(careerPath.difficulty)}>
                {careerPath.difficulty}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Thời lượng</p>
              <p className="font-medium">{careerPath.duration}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày tạo</p>
              <p className="font-medium">{formatDate(careerPath.createdAt)}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm text-gray-500 mb-2">Mô tả</p>
            <p className="text-gray-700">{careerPath.description}</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">{careerPath.totalLessons}</p>
                    <p className="text-sm text-gray-500">Bài học</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">{careerPath.studentsCount}</p>
                    <p className="text-sm text-gray-500">Học viên</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">{careerPath.completionRate || "0"}%</p>
                    <p className="text-sm text-gray-500">Hoàn thành</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Lessons and Students */}
          <Tabs defaultValue="lessons" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="lessons">
                <BookOpen className="h-4 w-4 mr-2" />
                Bài học ({lessons.length})
              </TabsTrigger>
              <TabsTrigger value="students">
                <Users className="h-4 w-4 mr-2" />
                Học viên ({students.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lessons" className="space-y-3 mt-4">
              {lessons.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Chưa có bài học nào</p>
              ) : (
                lessons.map((lesson, index) => (
                  <Card key={lesson.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start flex-1">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold mr-3 flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {lesson.duration}
                              </span>
                              <span className="flex items-center">
                                <Play className="h-4 w-4 mr-1" />
                                {lesson.type}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={lesson.isPublished ? "success" : "secondary"}>
                          {lesson.isPublished ? "Published" : "Draft"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="students" className="space-y-3 mt-4">
              {students.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Chưa có học viên nào</p>
              ) : (
                students.map((student) => (
                  <Card key={student.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold mr-3">
                            {student.fullName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{student.fullName}</h4>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end mb-1">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" />
                            <span className="text-sm font-medium">{student.progress}%</span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {student.completedLessons}/{careerPath.totalLessons} bài
                          </p>
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

