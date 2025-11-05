import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Search, UserPlus } from "lucide-react";
import { useToast } from "../../../hooks/useToast";

// Mock available students
const AVAILABLE_STUDENTS = [
  { id: 1, fullName: "Nguyễn Văn A", email: "nguyenvana@example.com", studentCode: "SV001" },
  { id: 2, fullName: "Trần Thị B", email: "tranthib@example.com", studentCode: "SV002" },
  { id: 3, fullName: "Lê Văn C", email: "levanc@example.com", studentCode: "SV003" },
  { id: 4, fullName: "Phạm Thị D", email: "phamthid@example.com", studentCode: "SV004" },
  { id: 5, fullName: "Hoàng Văn E", email: "hoangvane@example.com", studentCode: "SV005" },
  { id: 6, fullName: "Võ Thị F", email: "vothif@example.com", studentCode: "SV006" },
  { id: 7, fullName: "Đặng Văn G", email: "dangvang@example.com", studentCode: "SV007" },
  { id: 8, fullName: "Bùi Thị H", email: "buithih@example.com", studentCode: "SV008" },
];

export default function AddStudentsModal({ careerPath, open, onClose, onAdd }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const { showToast } = useToast();

  const filteredStudents = AVAILABLE_STUDENTS.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.fullName.toLowerCase().includes(searchLower) ||
      student.email.toLowerCase().includes(searchLower) ||
      student.studentCode.toLowerCase().includes(searchLower)
    );
  });

  const toggleStudent = (student) => {
    setSelectedStudents((prev) => {
      const exists = prev.find((s) => s.id === student.id);
      if (exists) {
        return prev.filter((s) => s.id !== student.id);
      } else {
        return [...prev, student];
      }
    });
  };

  const handleAdd = () => {
    if (selectedStudents.length === 0) {
      showToast("Vui lòng chọn ít nhất 1 học viên", "error");
      return;
    }

    onAdd(selectedStudents);
    showToast(`Đã thêm ${selectedStudents.length} học viên vào lộ trình`, "success");
    setSelectedStudents([]);
    setSearchTerm("");
    onClose();
  };

  const handleClose = () => {
    setSelectedStudents([]);
    setSearchTerm("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            Thêm học viên vào: {careerPath?.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm theo tên, email, mã SV..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected Count */}
          {selectedStudents.length > 0 && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <Badge variant="default">{selectedStudents.length}</Badge>
              <span className="text-sm text-blue-700">học viên đã chọn</span>
            </div>
          )}

          {/* Student List */}
          <div className="border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
            {filteredStudents.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Không tìm thấy học viên</p>
            ) : (
              <div className="divide-y">
                {filteredStudents.map((student) => {
                  const isSelected = selectedStudents.find((s) => s.id === student.id);
                  return (
                    <div
                      key={student.id}
                      onClick={() => toggleStudent(student)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        isSelected ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold mr-3">
                            {student.fullName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{student.fullName}</h4>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{student.studentCode}</Badge>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button onClick={handleAdd} disabled={selectedStudents.length === 0}>
            <UserPlus className="h-4 w-4 mr-2" />
            Thêm {selectedStudents.length > 0 && `(${selectedStudents.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

