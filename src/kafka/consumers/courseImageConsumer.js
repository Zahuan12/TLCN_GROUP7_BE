const CareerPathService = require("../../services/careerPathService");

class CourseImageConsumer {
  constructor(kafka) {
    this.kafka = kafka;
    this.consumer = this.kafka.consumer({ groupId: "course-image-group" });
    this.topic = process.env.KAFKA_COURSE_IMAGE_TOPIC || "course-image-events";
  }

  async start() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: this.topic, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const data = JSON.parse(message.value.toString());
        console.log("[Kafka] Received course image event:", data.courseId);

        try {
          await CareerPathService.uploadAndUpdateCourseImage(
            data.courseId,
            data.bufferBase64
          );
        } catch (err) {
          console.error("[CourseImageConsumer] Upload error:", err.message);
          // Nếu cần retry, có thể implement logic retry tại đây
        }
      },
    });

    console.log("[Kafka] CourseImageConsumer started and listening...");
  }
}

module.exports = CourseImageConsumer;
