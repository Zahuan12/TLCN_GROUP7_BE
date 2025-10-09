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
        mailService.sendMail(data);
        // TODO: gọi MailService.sendMail(data) nếu cần gửi thật
      },
    });

    console.log("[Kafka] MailConsumer started");
  }
}

module.exports = MailConsumer;
