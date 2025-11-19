// producers/challengeTestProducer.js
class ChallengeTestProducer {
  constructor(kafka) {
    this.producer = kafka.producer();
    this.topic = process.env.KAFKA_CHALLENGE_TEST_TOPIC || "challenge-test-events";
  }

  async connect() {
    await this.producer.connect();
    console.log("[Kafka] ChallengeTestProducer connected");
  }

  async sendEvent(data) {
    if (!data.challengeTestId || !data.type) {
      console.error("[Kafka] Missing challengeTestId or type:", data);
      return;
    }

    await this.producer.send({
      topic: this.topic,
      messages: [{ 
        key: data.challengeTestId.toString(),
        value: JSON.stringify(data) 
      }]
    });

    console.log(`[Kafka] Sent event for ChallengeTest ${data.challengeTestId}, type: ${data.type}`);
  }
}

module.exports = ChallengeTestProducer;
