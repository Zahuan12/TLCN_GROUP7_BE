const CourseImageHandler = require("../../handles/courseImageHandler");

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
        console.log("[Kafka] Received course image event:", data.courseId, data.type);

        try {
          // Chỉ gọi handler, tất cả logic xử lý ảnh và DB nằm trong handler
          await CourseImageHandler.handleCourseImage(data);
        } catch (err) {
          console.error("[CourseImageConsumer] Error:", err.message);
        }
      }
    });

    console.log("[Kafka] CourseImageConsumer started and listening...");
  }
}

module.exports = CourseImageConsumer;
