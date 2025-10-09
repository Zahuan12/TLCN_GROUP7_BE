class MailProducer {
  constructor(kafka) {
    this.producer = kafka.producer();
  }

  async connect() {
    await this.producer.connect();
    console.log("[Kafka] MailProducer connected");
  }

  async sendMailEvent(data) {
    await this.producer.send({
      topic: "mail-events",
      messages: [{ value: JSON.stringify(data) }],
    });
    console.log("[Kafka] Mail event sent:", data);
  }
}

module.exports = MailProducer;
