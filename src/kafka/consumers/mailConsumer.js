const mailService = require('../../services/mailService');
class MailConsumer {
  constructor(kafka) {
    this.kafka = kafka;
    this.consumer = this.kafka.consumer({ groupId: "mail-group" });
  }

  async start() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: "mail-events", fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const data = JSON.parse(message.value.toString());
        console.log("[Kafka] Received mail event:", data);
        try {
          await mailService.sendWelcomeEmail({
            email: data.to,              // lấy từ event Kafka
            fullName: data.fullName,     // hoặc username, tùy bạn gửi từ Producer
            username: data.username
          });
          console.log("[MailConsumer] Email đã được gửi tới:", data.to);
        } catch (err) {
          console.error("[MailConsumer] Lỗi khi gửi email:", err.message);
        }
      },
    });

    console.log("[Kafka] MailConsumer started");
  }
}

module.exports = MailConsumer;