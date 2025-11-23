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
            attributes: ['id', 'title', 'description'],
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
6. KHI SINH VIÊN HỎI VỀ KHÓA HỌC CÓ SẴN: Sử dụng function search_courses để tìm kiếm và giới thiệu các khóa học thực tế trên nền tảng

PHONG CÁCH GIAO TIẾP:
- Thân thiện, nhiệt tình và dễ hiểu
- Sử dụng tiếng Việt
- Ngắn gọn nhưng đầy đủ thông tin
- Đưa ra ví dụ cụ thể khi cần thiết
- Luôn dựa trên dữ liệu thực tế của sinh viên để đưa ra lời khuyên

GIỚI HẠN VÀ RANH GIỚI:
- KHÔNG trả lời các câu hỏi về chính trị, tôn giáo, bạo lực, nội dung 18+, phân biệt chủng tộc
- KHÔNG cung cấp lời khuyên y tế, pháp lý hoặc tài chính cá nhân
- KHÔNG giúp làm bài tập hoặc gian lận trong thi cử
- TUYỆT ĐỐI KHÔNG tiết lộ bất kỳ thông tin kỹ thuật nào về hệ thống: API keys, tokens, passwords, database credentials, server config, source code, environment variables
- KHÔNG trả lời câu hỏi về cấu trúc database, bảng, trường dữ liệu, query SQL
- KHÔNG cung cấp thông tin về kiến trúc hệ thống, deployment, hosting, backend logic
- Nếu bị hỏi về thông tin kỹ thuật/bảo mật: "Tôi không có quyền truy cập hoặc chia sẻ thông tin kỹ thuật của hệ thống. Vui lòng liên hệ bộ phận IT nếu bạn cần hỗ trợ kỹ thuật."
- Nếu được hỏi những câu hỏi không phù hợp, lịch sự từ chối và hướng về chủ đề học tập
- Ví dụ: "Xin lỗi, tôi chỉ có thể hỗ trợ các vấn đề liên quan đến học tập và phát triển kỹ năng. Bạn có câu hỏi gì về khóa học hoặc lộ trình học của mình không?"`;
  }

  /**
   * Search for career paths/courses based on user query
   */
  async searchCourses(query) {
    try {
      const { Op } = require('sequelize');
      
      const courses = await db.CareerPath.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${query}%` } },
            { description: { [Op.like]: `%${query}%` } }
          ]
        },
        include: [
          {
            model: db.Company,
            as: 'company',
            attributes: ['companyName', 'id']
          }
        ],
        limit: 5,
        attributes: ['id', 'title', 'description', 'image']
      });

      return courses.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        company: course.company?.companyName,
        image: course.image,
        url: `/career-paths/${course.id}`
      }));
    } catch (error) {
      console.error('[AIService.searchCourses] Error:', error);
      return [];
    }
  }

  /**
   * Check if message contains security-sensitive keywords
   */
  isSecuritySensitiveQuery(message) {
    const sensitiveKeywords = [
      // Security & Auth
      'api key', 'api_key', 'apikey', 'token', 'jwt', 'secret', 'password', 'credential',
      'access key', 'private key', 'public key', 'auth', 'authentication',
      // Database
      'database', 'db', 'sql', 'query', 'table', 'schema', 'mongodb', 'mysql', 'postgres',
      'connection string', 'database url',
      // System & Config
      'env', 'environment variable', 'config', 'configuration', '.env', 'dotenv',
      'server', 'host', 'port', 'deployment', 'docker', 'kubernetes',
      // Code & Structure
      'source code', 'code base', 'backend', 'endpoint', 'api endpoint', 'route',
      'middleware', 'controller', 'model', 'repository', 'service',
      // Vietnamese
      'mật khẩu', 'khóa api', 'token', 'cơ sở dữ liệu', 'database', 'mã nguồn', 
      'cấu hình', 'config', 'server', 'bảo mật', 'key'
    ];

    const lowerMessage = message.toLowerCase();
    return sensitiveKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  /**
   * Chat with AI with function calling support
   */
  async chat(messages, studentContext) {
    try {
      // Check for security-sensitive queries
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === 'user' && this.isSecuritySensitiveQuery(lastMessage.content)) {
        return 'Tôi không có quyền truy cập hoặc chia sẻ thông tin kỹ thuật, bảo mật của hệ thống. Tôi chỉ có thể hỗ trợ bạn về các vấn đề học tập, khóa học và phát triển kỹ năng. Bạn có câu hỏi gì về lộ trình học của mình không?';
      }

      const systemPrompt = this.buildSystemPrompt(studentContext);

      // First request with function calling
      const response = await groqClient.post('/chat/completions', {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'search_courses',
              description: 'Tìm kiếm các khóa học/career path phù hợp với yêu cầu của sinh viên. Sử dụng khi sinh viên hỏi về khóa học có sẵn, muốn tìm khóa học theo chủ đề, hoặc cần gợi ý khóa học.',
              parameters: {
                type: 'object',
                properties: {
                  query: {
                    type: 'string',
                    description: 'Từ khóa tìm kiếm (ví dụ: "java", "frontend", "data science", "backend")'
                  }
                },
                required: ['query']
              }
            }
          }
        ],
        tool_choice: 'auto',
        temperature: 0.7,
        max_tokens: 1024
      });

      const assistantMessage = response.data.choices[0].message;

      // Check if AI wants to call function
      if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        const toolCall = assistantMessage.tool_calls[0];
        
        if (toolCall.function.name === 'search_courses') {
          const args = JSON.parse(toolCall.function.arguments);
          const searchResults = await this.searchCourses(args.query);

          // Second request with function result
          const finalResponse = await groqClient.post('/chat/completions', {
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              ...messages,
              assistantMessage,
              {
                role: 'tool',
                tool_call_id: toolCall.id,
                content: JSON.stringify(searchResults)
              }
            ],
            temperature: 0.7,
            max_tokens: 1024
          });

          return finalResponse.data.choices[0].message.content;
        }
      }

      return assistantMessage.content;
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
