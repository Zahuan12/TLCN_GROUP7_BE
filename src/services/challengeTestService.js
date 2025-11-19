const db = require('../models');
const kafkaModule = require('../kafka');

class ChallengeTestService {

  /** CREATE */
  async create(companyId, data, files) {
  const { title, description, deadline, maxScore } = data;

  const challenge = await db.ChallengeTest.create({
    title,
    description,
    deadline,
    maxScore,
    companyId,
    image: null,
    fileUrl: null
  });

  const image = files?.image?.[0] || null;
  const file = files?.file?.[0] || null;

  // IMAGE
  if (image) {
    await kafkaModule.producers.challengeProducer.sendImageUploadEvent({
      challengeTestId: challenge.id,
      type: "CREATE_IMAGE",
      bufferBase64: image.buffer.toString("base64"),
      mimeType: image.mimetype
    });
  }

  // FILE
  if (file) {
    await kafkaModule.producers.challengeProducer.sendFileUploadEvent({
      challengeTestId: challenge.id,
      type: "UPLOAD_FILE",
      bufferBase64: file.buffer.toString("base64"),
      mimeType: file.mimetype
    });
  }
  return await db.ChallengeTest.findByPk(challenge.id);
}

  /** GET ALL */
  async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const total = await db.ChallengeTest.count();

    const list = await db.ChallengeTest.findAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']],
      include: [{ model: db.Company, attributes: ['id', 'name'] }]
    });

    return {
      total,
      list,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    };
  }

  /** GET BY ID */
  async getById(id) {
    const challenge = await db.ChallengeTest.findByPk(id, {
      include: [{ model: db.Company, attributes: ['id', 'name'] }]
    });

    if (!challenge) throw new Error('Không tìm thấy Challenge Test');

    return challenge;
  }

  /** UPDATE */
  async update(companyId, id, data, files) {
    const challenge = await db.ChallengeTest.findByPk(id);
    if (!challenge) throw new Error('Challenge Test không tồn tại');

    if (challenge.companyId !== companyId)
      throw new Error('Không có quyền sửa Challenge này');

    await challenge.update({
      title: data.title ?? challenge.title,
      description: data.description ?? challenge.description,
      deadline: data.deadline ?? challenge.deadline,
      maxScore: data.maxScore ?? challenge.maxScore
    });

    // File update
    const newImage = files?.image?.[0];
    const newFile = files?.file?.[0];

    if (newImage) {
      await kafkaModule.producers.challengeProducer.sendImageUploadEvent({
        challengeTestId: challenge.id,
        type: 'image',
        bufferBase64: newImage.buffer.toString('base64'),
        mimeType: newImage.mimetype
      });
    }

    if (newFile) {
      await kafkaModule.producers.challengeProducer.sendFileUploadEvent({
        challengeTestId: challenge.id,
        type: 'file',
        bufferBase64: newFile.buffer.toString('base64'),
        mimeType: newFile.mimetype
      });
    }

    return await this.getById(id);
  }

  /** DELETE */
  async delete(companyId, id) {
    const challenge = await db.ChallengeTest.findByPk(id);

    if (!challenge) {
      const e = new Error('Challenge Test không tồn tại');
      e.statusCode = 404;
      throw e;
    }

    if (challenge.companyId !== companyId) {
      const e = new Error('Không có quyền xóa');
      e.statusCode = 403;
      throw e;
    }

    await challenge.destroy();
  }
}

module.exports = new ChallengeTestService();
