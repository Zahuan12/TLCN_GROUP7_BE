const groqClient = require('../configs/groqClient');
const db = require('../models');

class TestGradingService {
  /**
   * Grade test submission with AI
   */
  async gradeTest(testId, studentId, answers) {
    try {
      // Get test with content
      const test = await db.Test.findByPk(testId, {
        include: [
          {
            model: db.Lesson,
            as: 'lesson',
            attributes: ['title']
          }
        ]
      });

      if (!test) {
        throw new Error('Test not found');
      }

      // Parse test content
      const testContent = this.parseTestContent(test.content);
      
      // Build grading prompt
      const gradingPrompt = this.buildGradingPrompt(testContent, answers);

      // Call AI for grading
      const response = await groqClient.post('/chat/completions', {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `Bạn là một giáo viên chấm điểm chuyên nghiệp. Nhiệm vụ của bạn là chấm bài kiểm tra một cách khách quan và công bằng.

CHI TIẾT NHIỆM VỤ:
1. Đánh giá từng câu trả lời của học sinh
2. So sánh với đáp án đúng hoặc tiêu chí chấm điểm
3. Tính điểm cho từng câu dựa trên số điểm tối đa
4. Đưa ra nhận xét chi tiết cho từng câu (đúng/sai/một phần đúng)
5. Tổng hợp điểm và đưa ra nhận xét chung

QUAN TRỌNG - CHẾ ĐỘ CHẤM ĐIỂM:
- Multiple choice: Đúng 100%, sai 0%
- True/False: Đúng 100%, sai 0%
- Short answer: Có thể cho điểm từng phần (0-100%) nếu câu trả lời đúng một phần
- Essay: Đánh giá theo tiêu chí (nội dung, logic, trình bày) cho điểm 0-100%
- Coding: Đánh giá đa tiêu chí (xem hướng dẫn bên dưới)

ĐỐI VỚI BÀI CODE (type: 'coding'):
1. PHÂN TÍCH LOGIC (40%):
   - Thuật toán có đúng không?
   - Xử lý đầu vào/đầu ra có chính xác?
   - Logic có rõ ràng, dễ hiểu?

2. KIỂM TRA TEST CASES (30%):
   - Chạy qua từng test case trong đề bài
   - Kiểm tra input/output có khớp không?
   - Xử lý edge cases có đúng?

3. CHẤT LƯỢNG CODE (30%):
   - Code có sạch, dễ đọc?
   - Có comments, tên biến rõ ràng?
   - Có tối ưu về hiệu suất?
   - Xử lý lỗi có tốt?

HƯỚNG DẪN CHẤM ĐIỂM CODE:
- Code đúng logic nhưng có lỗi cú pháp nhỏ: 70-80%
- Code pass tất cả test cases: tối thiểu 80%
- Code pass tests + clean + tối ưu: 90-100%
- Code sai logic hoặc không chạy: 0-30%
- Code đúng một phần: 40-70% tùy mức độ

OUTPUT FORMAT (JSON):
{
  "score": <tổng điểm>,
  "correctCount": <số câu đúng hoàn toàn>,
  "totalQuestions": <tổng số câu>,
  "feedback": "<nhận xét chung>",
  "suggestions": "<gợi ý cải thiện>",
  "details": [
    {
      "questionId": "<id câu hỏi>",
      "isCorrect": <true/false/partial>,
      "points": <điểm đạt được>,
      "explanation": "<giải thích chi tiết>"
    }
  ]
}`
          },
          { role: 'user', content: gradingPrompt }
        ],
        temperature: 0.3, // Lower for consistency in grading
        max_tokens: 3000
      });

      const aiResult = response.data.choices[0].message.content;
      
      // Parse AI response
      let gradingResult;
      try {
        // Extract JSON from markdown code blocks if present
        const jsonMatch = aiResult.match(/```json\n([\s\S]*?)\n```/) || aiResult.match(/```\n([\s\S]*?)\n```/);
        const jsonStr = jsonMatch ? jsonMatch[1] : aiResult;
        gradingResult = JSON.parse(jsonStr);
      } catch (parseError) {
        console.error('[TestGradingService] Failed to parse AI response:', parseError);
        throw new Error('Lỗi parse kết quả chấm điểm từ AI');
      }

      return gradingResult;
    } catch (error) {
      console.error('[TestGradingService.gradeTest] Error:', error);
      throw error;
    }
  }

  /**
   * Parse test content from JSON or TEXT
   */
  parseTestContent(content) {
    // Nếu content là TEXT (không phải JSON) - format mới
    if (typeof content === 'string') {
      // Thử parse JSON (format cũ)
      try {
        const parsed = JSON.parse(content);
        if (parsed.questions && Array.isArray(parsed.questions)) {
          return parsed;
        }
      } catch (e) {
        // Không phải JSON, là TEXT thuần - tạo structure đơn giản
        return {
          questions: [{
            id: '1',
            type: 'essay',
            question: 'Câu hỏi tổng hợp',
            points: 100,
            rubric: 'Đánh giá toàn bộ bài làm dựa trên đề bài'
          }],
          testContent: content // Lưu đề bài TEXT gốc
        };
      }
    }
    return content;
  }

  /**
   * Build grading prompt for AI
   */
  buildGradingPrompt(testContent, studentAnswers) {
    const questions = testContent.questions || [];
    
    let prompt = `Hãy chấm bài kiểm tra sau:\n\n`;
    
    // Nếu có testContent (format TEXT), thêm đề bài gốc
    if (testContent.testContent) {
      prompt += `**ĐỀ BÀI:**\n${testContent.testContent}\n\n`;
      prompt += `**CÂU TRẢ LỜI CỦA HỌC SINH:**\n${studentAnswers[0]?.answer || '(Không có)'}\n\n`;
      prompt += `Hãy chấm điểm bài làm này dựa trên đề bài trên (thang điểm 100).\n`;
      return prompt;
    }
    
    prompt += `**TỔNG SỐ CÂU HỎI**: ${questions.length}\n\n`;

    questions.forEach((q, index) => {
      prompt += `---\n**CÂU ${index + 1}** (${q.points || 10} điểm) - Loại: ${q.type}\n`;
      prompt += `Câu hỏi: ${q.question}\n`;

      // Handle different question types
      if (q.type === 'multiple-choice' && q.options) {
        prompt += `Các lựa chọn:\n`;
        q.options.forEach((opt, i) => {
          prompt += `  ${String.fromCharCode(65 + i)}. ${opt}\n`;
        });
        prompt += `Đáp án đúng: ${q.correctAnswer}\n`;
      } else if (q.type === 'true-false') {
        prompt += `Đáp án đúng: ${q.correctAnswer}\n`;
      } else if (q.type === 'short-answer') {
        prompt += `Đáp án mẫu: ${q.correctAnswer}\n`;
        if (q.keywords && q.keywords.length > 0) {
          prompt += `Từ khóa cần có: ${q.keywords.join(', ')}\n`;
        }
      } else if (q.type === 'essay') {
        prompt += `Tiêu chí chấm: ${q.rubric || 'Nội dung, logic, trình bày'}\n`;
        if (q.keywords && q.keywords.length > 0) {
          prompt += `Từ khóa mong đợi: ${q.keywords.join(', ')}\n`;
        }
      } else if (q.type === 'coding') {
        prompt += `Ngôn ngữ: ${q.language || 'Không xác định'}\n`;
        if (q.constraints) {
          prompt += `Ràng buộc: ${q.constraints}\n`;
        }
        if (q.testCases && q.testCases.length > 0) {
          prompt += `Test cases:\n`;
          q.testCases.forEach((tc, i) => {
            prompt += `  Test ${i + 1}:\n`;
            prompt += `    Input: ${JSON.stringify(tc.input)}\n`;
            prompt += `    Expected Output: ${JSON.stringify(tc.output)}\n`;
            if (tc.explanation) {
              prompt += `    Giải thích: ${tc.explanation}\n`;
            }
          });
        }
        if (q.sampleCode) {
          prompt += `Sample code:\n\`\`\`${q.language || ''}\n${q.sampleCode}\n\`\`\`\n`;
        }
      }

      // Student's answer
      const studentAnswer = studentAnswers.find(a => a.questionId === q.id);
      if (studentAnswer) {
        if (q.type === 'coding') {
          prompt += `\n**Câu trả lời của học sinh:**\n\`\`\`${q.language || ''}\n${studentAnswer.answer}\n\`\`\`\n\n`;
        } else {
          prompt += `\n**Câu trả lời của học sinh:** ${studentAnswer.answer}\n\n`;
        }
      } else {
        prompt += `\n**Câu trả lời của học sinh:** (Không có)\n\n`;
      }
    });

    prompt += `---\n\nHãy chấm điểm và trả về kết quả theo format JSON đã yêu cầu.`;

    return prompt;
  }

  /**
   * Generate detailed feedback based on grading result
   */
  generateDetailedFeedback(gradingResult) {
    const { score, correctCount, totalQuestions, feedback, suggestions } = gradingResult;
    
    let detailedFeedback = `### KẾT QUẢ BÀI KIỂM TRA\n\n`;
    detailedFeedback += `**Tổng điểm:** ${score}/${totalQuestions * 10}\n`;
    detailedFeedback += `**Số câu đúng:** ${correctCount}/${totalQuestions}\n\n`;
    detailedFeedback += `**Nhận xét:** ${feedback}\n\n`;
    
    if (suggestions) {
      detailedFeedback += `**Gợi ý cải thiện:** ${suggestions}\n\n`;
    }

    return detailedFeedback;
  }
}

module.exports = new TestGradingService();
