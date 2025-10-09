const kafka = require("../configs/kafka");
const producers = require("./producers");
const consumers = require("./consumers");

class KafkaManager {
  constructor() {
    this.kafka = kafka;

    // Khởi tạo tất cả producer
    this.producers = {
      mailProducer: new producers.mailProducer(this.kafka),
    };

    // Khởi tạo tất cả consumer
    this.consumers = {
      mailConsumer: new consumers.mailConsumer(this.kafka),
    };
  }

  async init() {
    console.log("[Kafka] Initializing...");

    // ✅ Kết nối tất cả producer
    for (const key in this.producers) {
      await this.producers[key].connect();
    }

    // ✅ Khởi chạy tất cả consumer
    for (const key in this.consumers) {
      await this.consumers[key].start();
    }

    console.log("[Kafka] All producers and consumers started");
  }
}

module.exports = new KafkaManager();
