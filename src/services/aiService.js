const groqClient = require('../configs/groqClient');
const db = require('../models');

class AIService {
  /**
   * Build student context from their learning progress
   */
  async buildStudentContext(studentId) {
    try {
      // Get student info
      const student = await db.Student.findByPk(studentId, {
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: ['fullName', 'email']
          }
        ]
      });

      if (!student) {
        throw new Error('Student not found');
      }

      // Get enrolled courses with progress
      const enrolledCourses = await db.StudentProgress.findAll({
        where: { studentId },
        include: [
          {
            model: db.CareerPath,
            as: 'careerPath',
            attributes: ['id', 'title', 'description', 'level'],
            include: [
              {
                model: db.Company,
                as: 'company',
                attributes: ['companyName']
              }
            ]
          }
        ]
      });

      // Get test results
      const testResults = await db.StudentTestResult.findAll({
        where: { studentId },
        include: [
          {
            model: db.Test,
            as: 'test',
            attributes: ['id', 'title', 'type'],
            include: [
              {
                model: db.Lesson,
                as: 'lesson',
                attributes: ['title']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: 10
      });

      // Format context
      const context = {
        studentName: student.user?.fullName || 'Student',
        email: student.user?.email,
        enrolledCourses: enrolledCourses.map(ec => ({
          courseTitle: ec.careerPath?.title,
          level: ec.careerPath?.level,
          company: ec.careerPath?.company?.companyName,
          progress: ec.progress,
          completedLessons: ec.completedLessons
        })),
        recentTests: testResults.map(tr => ({
          testTitle: tr.test?.title,
          lessonTitle: tr.test?.lesson?.title,
          type: tr.test?.type,
          score: tr.score,
          passed: tr.passed,
          completedAt: tr.completedAt
        })),
        totalCourses: enrolledCourses.length,
        averageScore: testResults.length > 0
          ? (testResults.reduce((sum, tr) => sum + (tr.score || 0), 0) / testResults.length).toFixed(2)
          : 0
      };

      return context;
    } catch (error) {
      console.error('[AIService.buildStudentContext] Error:', error);
      throw error;
    }
  }

  /**
   * Build system prompt with student context
   */
  buildSystemPrompt(studentContext) {
    return `Bạn là một trợ lý AI thông minh cho nền tảng học tập trực tuyến, chuyên hỗ trợ sinh viên về các vấn đề học tập, định hướng nghề nghiệp và phát triển kỹ năng.

THÔNG TIN SINH VIÊN:
- Tên: ${studentContext.studentName}
- Số khóa học đang tham gia: ${studentContext.totalCourses}
- Điểm trung bình: ${studentContext.averageScore}
- Các khóa học đã đăng ký: ${studentContext.enrolledCourses.map(c => `${c.courseTitle} (${c.level}) - Tiến độ: ${c.progress}%`).join(', ') || 'Chưa có'}
- Kết quả bài kiểm tra gần đây: ${studentContext.recentTests.slice(0, 3).map(t => `${t.testTitle}: ${t.score} điểm (${t.passed ? 'Đạt' : 'Chưa đạt'})`).join(', ') || 'Chưa có'}

NHIỆM VỤ CỦA BẠN:
1. Trả lời các câu hỏi của sinh viên về nội dung học tập, khóa học, bài kiểm tra
2. Đưa ra lời khuyên học tập dựa trên tiến độ và kết quả hiện tại
3. Động viên và khích lệ sinh viên khi gặp khó khăn
4. Gợi ý các khóa học phù hợp hoặc cách cải thiện kết quả học tập
5. Giải đáp thắc mắc về định hướng nghề nghiệp

PHONG CÁCH GIAO TIẾP:
- Thân thiện, nhiệt tình và dễ hiểu
- Sử dụng tiếng Việt
- Ngắn gọn nhưng đầy đủ thông tin
- Đưa ra ví dụ cụ thể khi cần thiết
- Luôn dựa trên dữ liệu thực tế của sinh viên để đưa ra lời khuyên`;
  }

  /**
   * Chat with AI
   */
  async chat(messages, studentContext) {
    try {
      const systemPrompt = this.buildSystemPrompt(studentContext);

      const response = await groqClient.post('/chat/completions', {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1024
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('[AIService.chat] Error:', error.response?.data || error.message);
      throw new Error('Lỗi khi gọi AI: ' + (error.response?.data?.error?.message || error.message));
    }
  }

  /**
   * Generate personalized assessment
   */
  async generateAssessment(studentContext) {
    try {
      const prompt = `Dựa trên dữ liệu học tập của sinh viên ${studentContext.studentName}, hãy tạo một báo cáo đánh giá chi tiết bao gồm:

1. TỔNG QUAN HIỆN TRẠNG: Đánh giá tổng quan về tiến độ học tập hiện tại
2. ĐIỂM MẠNH: Những mặt học sinh đang làm tốt
3. ĐIỂM CẦN CẢI THIỆN: Những kỹ năng hoặc kiến thức cần bổ sung
4. GỢI Ý PHÁT TRIỂN: Đề xuất cụ thể để cải thiện (khóa học, kỹ năng, phương pháp học)
5. KẾ HOẠCH HÀNH ĐỘNG: 3-5 bước cụ thể sinh viên nên thực hiện trong thời gian tới

DỮ LIỆU:
- Số khóa học: ${studentContext.totalCourses}
- Điểm TB: ${studentContext.averageScore}
- Khóa học đang học: ${JSON.stringify(studentContext.enrolledCourses)}
- Kết quả kiểm tra: ${JSON.stringify(studentContext.recentTests)}

Hãy viết báo cáo bằng tiếng Việt, chi tiết, cụ thể và mang tính xây dựng.`;

      const response = await groqClient.post('/chat/completions', {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Bạn là một chuyên gia tư vấn giáo dục và định hướng nghề nghiệp.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 2048
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('[AIService.generateAssessment] Error:', error.response?.data || error.message);
      throw new Error('Lỗi khi tạo đánh giá: ' + (error.response?.data?.error?.message || error.message));
    }
  }

  /**
   * Generate session title from first message
   */
  async generateSessionTitle(firstMessage) {
    try {
      const response = await groqClient.post('/chat/completions', {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Tạo một tiêu đề ngắn gọn (tối đa 50 ký tự) cho cuộc trò chuyện dựa trên tin nhắn đầu tiên. Chỉ trả về tiêu đề, không giải thích.'
          },
          { role: 'user', content: firstMessage }
        ],
        temperature: 0.7,
        max_tokens: 50
      });

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('[AIService.generateSessionTitle] Error:', error);
      return 'Trò chuyện với AI';
    }
  }
}

module.exports = new AIService();
