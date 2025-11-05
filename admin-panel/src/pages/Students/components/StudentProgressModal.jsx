import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Card, CardContent } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";
import { Badge } from "../../../components/ui/badge";
import { formatDate } from "../../../utils/formatDate";
import { CheckCircle2, Circle, Clock, Play } from "lucide-react";

export default function StudentProgressModal({ student, careerPath, lessons = [], open, onClose }) {
  if (!student || !careerPath) return null;

  const completedCount = lessons.filter(l => l.isCompleted).length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Tiến độ học tập</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-start gap-4 pb-4 border-b">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold text-2xl">
              {student.fullName.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">{student.fullName}</h3>
              <p className="text-gray-600 mt-1">{careerPath.title}</p>
              <p className="text-sm text-gray-500">{careerPath.companyName}</p>
            </div>
          </div>

          {/* Overall Progress */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Tiến độ tổng thể</span>
                  <span className="text-2xl font-bold text-blue-600">{progressPercent}%</span>
                </div>
                <Progress value={progressPercent} className="h-3" />
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{completedCount}/{lessons.length} bài học hoàn thành</span>
                  <span>Tham gia: {formatDate(careerPath.enrolledDate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lessons List */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Danh sách bài học</h4>
            {lessons.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Chưa có bài học nào</p>
            ) : (
              <div className="space-y-2">
                {lessons.map((lesson, index) => (
                  <Card 
                    key={lesson.id}
                    className={lesson.isCompleted ? "bg-green-50 border-green-200" : ""}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Lesson Number & Status Icon */}
                        <div className="flex-shrink-0">
                          {lesson.isCompleted ? (
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                              <CheckCircle2 className="h-5 w-5 text-white" />
                            </div>
                          ) : lesson.isInProgress ? (
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                              <Play className="h-4 w-4 text-white" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
                              <Circle className="h-5 w-5 text-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* Lesson Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-semibold text-gray-900">
                                {index + 1}. {lesson.title}
                              </h5>
                              <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                            </div>
                            <div className="ml-4">
                              {lesson.isCompleted && (
                                <Badge variant="success">Hoàn thành</Badge>
                              )}
                              {lesson.isInProgress && !lesson.isCompleted && (
                                <Badge variant="default">Đang học</Badge>
                              )}
                              {!lesson.isCompleted && !lesson.isInProgress && (
                                <Badge variant="secondary">Chưa học</Badge>
                              )}
                            </div>
                          </div>

                          {/* Meta Info */}
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {lesson.duration}
                            </span>
                            <span className="flex items-center">
                              <Play className="h-3 w-3 mr-1" />
                              {lesson.type}
                            </span>
                            {lesson.completedDate && (
                              <span>Hoàn thành: {formatDate(lesson.completedDate)}</span>
                            )}
                          </div>

                          {/* Score if completed */}
                          {lesson.isCompleted && lesson.score !== undefined && (
                            <div className="mt-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Điểm số:</span>
                                <span className={`font-bold ${
                                  lesson.score >= 80 ? "text-green-600" : 
                                  lesson.score >= 60 ? "text-yellow-600" : 
                                  "text-red-600"
                                }`}>
                                  {lesson.score}/100
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

