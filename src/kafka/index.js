const kafka = require("../configs/kafka");
const producers = require("./producers");
const consumers = require("./consumers");

class KafkaManager {
  constructor() {
    this.kafka = kafka;

    // Khởi tạo tất cả producer
    this.producers = {
      mailProducer: new producers.mailProducer(this.kafka),
      blogMediaProducer: new producers.blogMediaProducer(this.kafka),
      courseImageProducer: new producers.courseImageProducer(this.kafka),
    };

    // Khởi tạo tất cả consumer
    this.consumers = {
      mailConsumer: new consumers.mailConsumer(this.kafka),
      blogMediaConsumer: new consumers.blogMediaConsumer(this.kafka),
      courseImageConsumer: new consumers.courseImageConsumer(this.kafka),
    };

    // Danh sách các topic cần check/tạo
    this.topics = [
      { topic: "mail-events", numPartitions: 1, replicationFactor: 1 },
      { topic: "blog-media-events", numPartitions: 1, replicationFactor: 1 },
      { topic: "course-image-events", numPartitions: 1, replicationFactor: 1 },
    ];
  }

  // Hàm check/create topic
  async ensureTopics() {
    const admin = this.kafka.admin();
    await admin.connect();

    const existingTopics = await admin.listTopics();

    const topicsToCreate = this.topics.filter(t => !existingTopics.includes(t.topic));

    if (topicsToCreate.length > 0) {
      console.log("[Kafka] Creating topics:", topicsToCreate.map(t => t.topic).join(", "));
      await admin.createTopics({
        topics: topicsToCreate,
        waitForLeaders: true, // đợi leader partition sẵn sàng
      });
    } else {
      console.log("[Kafka] All topics already exist");
    }

    await admin.disconnect();
  }

  async init() {
    console.log("[Kafka] Initializing...");

    // ✅ Check và tạo topic trước khi connect producer
    await this.ensureTopics();

    // ✅ Kết nối tất cả producer
    for (const key in this.producers) {
      await this.producers[key].connect();
      console.log(`[Kafka] ${key} connected`);
    }

    // ✅ Khởi chạy tất cả consumer
    for (const key in this.consumers) {
      await this.consumers[key].start();
      console.log(`[Kafka] ${key} started`);
    }

    console.log("[Kafka] All producers and consumers started");
  }
}

module.exports = new KafkaManager();
