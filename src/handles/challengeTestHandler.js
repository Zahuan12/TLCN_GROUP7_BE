const db = require("../models");
const cloudinary = require("../configs/cloudinary");
const { getDriveClient } = require("../configs/googleDrive.config");

class ChallengeTestHandler {
  // ---------------------- CLOUDINARY IMAGE UPLOAD ----------------------
  async uploadImage(bufferBase64) {
    const buffer = Buffer.from(bufferBase64, "base64");
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "challenge-tests", resource_type: "image" },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(buffer);
    });
    return uploadResult;
  }

  async deleteImage(publicId) {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  }

  // ---------------------- GOOGLE DRIVE FILE UPLOAD ----------------------
  async uploadFile(bufferBase64, mimeType) {
    const buffer = Buffer.from(bufferBase64, "base64");
    const drive = await getDriveClient();

    const fileName = `challenge-file-${Date.now()}`;
    const res = await drive.files.create({
      requestBody: { name: fileName, mimeType },
      media: { mimeType, body: buffer }
    });

    const fileId = res.data.id;

    // Cho phép public file
    await drive.permissions.create({
      fileId,
      requestBody: { role: "reader", type: "anyone" }
    });

    return {
      url: `https://drive.google.com/uc?id=${fileId}`,
      fileId
    };
  }

  // ---------------------- MAIN HANDLER ----------------------
  async handleChallengeTestFile({ challengeTestId, type, bufferBase64, mimeType, oldPublicId, oldFileId }) {
    const challenge = await db.ChallengeTest.findByPk(challengeTestId);
    if (!challenge) throw new Error("ChallengeTest không tồn tại");

    switch (type) {

      // ---- CREATE IMAGE ----
      case "CREATE_IMAGE":
        if (!bufferBase64) throw new Error("Missing image for CREATE_IMAGE");
        {
          const uploadResult = await this.uploadImage(bufferBase64);
          await challenge.update({
            image: uploadResult.secure_url,
            imagePublicId: uploadResult.public_id
          });
        }
        break;

      // ---- UPDATE IMAGE ----
      case "UPDATE_IMAGE":
        if (!bufferBase64) throw new Error("Missing image for UPDATE_IMAGE");

        if (oldPublicId) await this.deleteImage(oldPublicId);

        {
          const uploadResult = await this.uploadImage(bufferBase64);
          await challenge.update({
            image: uploadResult.secure_url,
            imagePublicId: uploadResult.public_id
          });
        }
        break;

      // ---- DELETE IMAGE ----
      case "DELETE_IMAGE":
        if (oldPublicId) await this.deleteImage(oldPublicId);
        await challenge.update({ image: null, imagePublicId: null });
        break;

      // ---- UPLOAD FILE (PDF/DOCX) ----
      case "UPLOAD_FILE":
        if (!bufferBase64 || !mimeType)
          throw new Error("Missing file or mimeType for UPLOAD_FILE");

        {
          const fileResult = await this.uploadFile(bufferBase64, mimeType);
          await challenge.update({
            fileUrl: fileResult.url,
            fileDriveId: fileResult.fileId
          });
        }
        break;

      // ---- DELETE FILE ----
      case "DELETE_FILE":
        if (oldFileId) {
          const drive = await getDriveClient();
          await drive.files.delete({ fileId: oldFileId }).catch(() => {});
        }
        await challenge.update({ fileUrl: null, fileDriveId: null });
        break;

      default:
        throw new Error("Unknown challenge test event type: " + type);
    }

    console.log(`[ChallengeTestHandler] Handled ${type} for challengeTestId ${challengeTestId}`);
  }
}

module.exports = new ChallengeTestHandler();
