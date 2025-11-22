const db = require('../models');
class StudentService {


 async joinCareerPath(studentId, careerPathId) {


    // Kiểm tra careerPath (vì careerPath luôn có companyId)
    const careerPath = await db.CareerPath.findByPk(careerPathId);
    if (!careerPath) throw new Error("Career path not found");

    // Kiểm tra đã tham gia chưa
    const exists = await db.StudentProgress.findOne({
      where: { studentId, careerPathId }
    });
    if (exists) throw new Error("You have already joined this career path");

    // Tạo progress
    return await db.StudentProgress.create({
      studentId,
      careerPathId,
      status: "IN_PROGRESS"
    });
  }

  async submitTest(studentId, testId, score) {

  const test = await db.Test.findByPk(testId);
  if (!test) throw new Error("Test not found");

  // 1) Xác định careerPath của test
  let careerPathId = test.careerPathId;

  if (!careerPathId && test.lessonId) {
    const lesson = await db.Lesson.findByPk(test.lessonId);
    careerPathId = lesson?.careerPathId;
  }

  if (!careerPathId) throw new Error("Invalid test: no career path linked");

  // 2) Kiểm tra đã join career path chưa
  let progress = await db.StudentProgress.findOne({
    where: { studentId, careerPathId }
  });

  if (!progress)
    throw new Error("You must join this career path first");

  // 3) Lưu bài test
  let existing = await db.StudentTestResult.findOne({
    where: { studentId, testId }
  });

  if (existing) {
    await existing.update({ score });
  } else {
    await db.StudentTestResult.create({
      studentId,
      testId,
      score
    });
  }

  // 4) Kiểm tra xem học sinh hoàn thành CareerPath chưa
  await this.checkCareerPathCompletion(studentId, careerPathId);

  return { message: "Test submitted successfully" };
}

async checkCareerPathCompletion(studentId, careerPathId) {
  // Lấy toàn bộ test trong careerPath
  const tests = await db.Test.findAll({
    where: {
      [db.Sequelize.Op.or]: [
        { careerPathId }, // FINAL test
      ]
    },
    include: [
      {
        model: db.Lesson,
        required: false,
        where: { careerPathId }
      }
    ]
  });

  if (!tests.length) return; // CareerPath chưa có test → ko đánh completed

  const testIds = tests.map(t => t.id);

  // Lấy toàn bộ bài test mà student đã làm
  const results = await db.StudentTestResult.findAll({
    where: { studentId, testId: testIds }
  });

  if (results.length === tests.length) {
    // cập nhật status = COMPLETED
    const progress = await db.StudentProgress.findOne({
      where: { studentId, careerPathId }
    });

    if (progress && progress.status !== "COMPLETED") {
      await progress.update({ status: "COMPLETED" });
    }
  }
}

  async getEnrolledCourses(userId) {
    const student = await db.Student.findOne({ where: { userId } });
    if (!student) throw new Error("Student không tồn tại");

    const enrolledCourses = await db.StudentProgress.findAll({
      where: { studentId: student.id },
      include: [
        {
          model: db.CareerPath,
          as: 'CareerPath',
          include: [
            {
              model: db.Company,
              as: 'Company',
              attributes: ['id', 'companyName', 'logo']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return enrolledCourses.map(progress => ({
      progressId: progress.id,
      status: progress.status,
      enrolledAt: progress.createdAt,
      course: progress.CareerPath
    }));
  }
   
  async updateProfile(userId, data) {
    const student = await db.Student.findOne({ where: { userId } });
    if (!student) throw new Error("Student không tồn tại");

    const updateData = {};
    if (data.major !== undefined) updateData.major = data.major;
    if (data.school !== undefined) updateData.school = data.school;

    if (Object.keys(updateData).length > 0) {
      await student.update(updateData);
    }

    return student;
  }
}
module.exports = new StudentService(); 