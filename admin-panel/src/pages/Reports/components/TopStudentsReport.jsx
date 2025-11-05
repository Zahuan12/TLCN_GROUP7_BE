import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Award, Medal, Trophy, TrendingUp } from "lucide-react";

export default function TopStudentsReport({ data }) {
  if (!data || !data.students) return null;

  const getMedalIcon = (rank) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <Award className="h-5 w-5 text-blue-500" />;
  };

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (rank === 2) return "bg-gray-100 text-gray-800 border-gray-300";
    if (rank === 3) return "bg-amber-100 text-amber-800 border-amber-300";
    return "bg-blue-100 text-blue-800 border-blue-300";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Bảng xếp hạng học sinh xuất sắc
          </CardTitle>
          <CardDescription>
            Top {data.students.length} sinh viên có thành tích học tập tốt nhất
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {data.students.map((student) => (
              <div
                key={student.id}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  student.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-amber-50' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Left: Rank + Student Info */}
                  <div className="flex items-center gap-4 flex-1">
                    {/* Rank Badge */}
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-lg ${getRankBadgeColor(student.rank)}`}>
                      {student.rank <= 3 ? (
                        getMedalIcon(student.rank)
                      ) : (
                        student.rank
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold text-xl">
                      {student.fullName.charAt(0)}
                    </div>

                    {/* Student Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900 text-lg">{student.fullName}</h4>
                        {student.rank === 1 && (
                          <Badge className="bg-yellow-500">🏆 #1</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{student.university}</p>
                      <p className="text-xs text-gray-500">{student.studentCode} • {student.major}</p>
                    </div>
                  </div>

                  {/* Right: Stats */}
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="text-sm text-gray-500">Điểm TB</p>
                      <p className="text-2xl font-bold text-blue-600">{student.avgScore}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hoàn thành</p>
                      <p className="text-2xl font-bold text-green-600">{student.completedLessons}</p>
                      <p className="text-xs text-gray-500">bài học</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tiến độ</p>
                      <p className="text-2xl font-bold text-purple-600">{student.progress}%</p>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                {student.achievements && student.achievements.length > 0 && (
                  <div className="mt-3 pt-3 border-t flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-500">Thành tích:</span>
                    {student.achievements.map((achievement, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {data.avgScore || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Điểm TB Top {data.students.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {data.totalCompleted || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Tổng bài học hoàn thành</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {data.avgProgress || 0}%
              </p>
              <p className="text-sm text-gray-500 mt-1">Tiến độ TB</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

