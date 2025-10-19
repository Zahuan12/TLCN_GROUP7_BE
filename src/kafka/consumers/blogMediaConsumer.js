const db = require("../../models");
const BlogService = require("../../services/blogService"); // ✅ dùng lại logic upload trong service

class BlogMediaConsumer {
  constructor(kafka) {
    this.kafka = kafka;
    this.consumer = this.kafka.consumer({ groupId: "blog-media-group" });
    this.topic = process.env.KAFKA_BLOG_MEDIA_TOPIC || "blog-media-events";
  }

  async start() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: this.topic, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const data = JSON.parse(message.value.toString());
        console.log("[Kafka] 📥 Received blog media event:", data.blogMediaId);

        try {
          // ✅ Gọi sang BlogService để xử lý upload và cập nhật DB
          await BlogService.uploadAndUpdateBlogMedia(
            data.blogMediaId,
            data.bufferBase64,
            data.type
          );

          console.log(`[BlogMediaConsumer] ✅ Completed ${data.blogMediaId}`);
        } catch (err) {
          console.error("[BlogMediaConsumer] ❌ Upload error:", err.message);
          await db.BlogMedia.update(
            { status: "error" },
            { where: { id: data.blogMediaId } }
          );
        }
      },
    });

    console.log("[Kafka] 🚀 BlogMediaConsumer started and listening...");
  }
}

module.exports = BlogMediaConsumer;
