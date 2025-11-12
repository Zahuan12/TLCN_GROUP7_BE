class CourseImageProducer {
  constructor(kafka) {
    this.producer = kafka.producer();
    this.topic = process.env.KAFKA_COURSE_IMAGE_TOPIC || "course-image-events";
  }

  async connect() {
    await this.producer.connect();
    console.log("[Kafka] CourseImageProducer connected");
  }

  async sendUploadEvent(data) {
    if (!data.courseId || !data.bufferBase64) {
      console.error("[Kafka] Missing courseId or bufferBase64:", data);
      return;
    }

    await this.producer.send({
      topic: this.topic,
      messages: [{ key: data.courseId, value: JSON.stringify(data) }],
    });

    console.log(`[Kafka] Course image upload event sent for ${data.courseId}`);
  }
}

module.exports = CourseImageProducer;
