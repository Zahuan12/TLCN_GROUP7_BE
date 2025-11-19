const ChallengeTestHandler = require("../../handles/challengeTestHandler");

class ChallengeTestConsumer {
  constructor(kafka) {
    this.kafka = kafka;
    this.consumer = this.kafka.consumer({ groupId: "challenge-test-group" });
    this.topic = process.env.KAFKA_CHALLENGE_TEST_TOPIC || "challenge-test-events";
  }

  async start() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: this.topic, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const data = JSON.parse(message.value.toString());

        console.log(
          `[Kafka] Received challengeTest event: challengeTestId=${data.challengeTestId}, type=${data.type}`
        );

        try {
          await ChallengeTestHandler.handleChallengeTestFile(data);
        } catch (err) {
          console.error("[ChallengeTestConsumer] Error:", err.message);
        }
      }
    });

    console.log("[Kafka] ChallengeTestConsumer started and listening...");
  }
}

module.exports = ChallengeTestConsumer;
