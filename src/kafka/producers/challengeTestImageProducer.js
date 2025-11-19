class ChallengeTestProducer {
  constructor(kafka) {
    this.producer = kafka.producer();
    this.topic = process.env.KAFKA_CHALLENGE_TEST_TOPIC || "challenge-test-events";
  }

  async connect() {
    await this.producer.connect();
    console.log("[Kafka] ChallengeTestProducer connected");
  }

  /** Gửi event hình */
  async sendImageUploadEvent(data) {
    if (!data.challengeTestId || !data.type) {
      console.error("[Kafka] Missing challengeTestId or type (image event)", data);
      return;
    }

    await this.producer.send({
      topic: this.topic,
      messages: [{ key: data.challengeTestId.toString(), value: JSON.stringify(data) }]
    });

    console.log(
      `[Kafka] Image event sent — challengeTestId=${data.challengeTestId}, type=${data.type}`
    );
  }

  /** Gửi event file */
  async sendFileUploadEvent(data) {
    if (!data.challengeTestId || !data.type) {
      console.error("[Kafka] Missing challengeTestId or type (file event)", data);
      return;
    }

    await this.producer.send({
      topic: this.topic,
      messages: [{ key: data.challengeTestId.toString(), value: JSON.stringify(data) }]
    });

    console.log(
      `[Kafka] File event sent — challengeTestId=${data.challengeTestId}, type=${data.type}`
    );
  }
}

module.exports = ChallengeTestProducer;
