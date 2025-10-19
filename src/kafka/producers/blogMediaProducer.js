class BlogMediaProducer {
  constructor(kafka) {
    this.producer = kafka.producer();
    this.topic = process.env.KAFKA_BLOG_MEDIA_TOPIC || "blog-media-events";
  }

  async connect() {
    await this.producer.connect();
    console.log("[Kafka] BlogMediaProducer connected");
  }

  /**
   * Gửi event upload media đến consumer
   * @param {Object} data - chứa blogMediaId, bufferBase64, mimeType, ...
   */
  async sendMediaUploadEvent(data) {
    if (!data.blogMediaId) {
      console.error("[Kafka] ❌ Thiếu blogMediaId trong payload:", data);
      return;
    }

    await this.producer.send({
      topic: this.topic,
      messages: [{ key: data.blogMediaId, value: JSON.stringify(data) }],
    });

    console.log(`[Kafka] 📤 Media event sent for BlogMedia ${data.blogMediaId}`);
  }
}

module.exports = BlogMediaProducer;
