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
    // data phải có courseId và type
    if (!data.courseId || !data.type) {
      console.error("[Kafka] Missing courseId or type:", data);
      return;
    }

    await this.producer.send({
      topic: this.topic,
      messages: [{ key: data.courseId.toString(), value: JSON.stringify(data) }]
    });

    console.log(`[Kafka] Course image event sent for courseId ${data.courseId}, type: ${data.type}`);
  }
}

module.exports = CourseImageProducer;
