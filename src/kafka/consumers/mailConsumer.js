// kafka/consumers/mailConsumer.js
const mailService = require('../../services/mailService');

class MailConsumer {
  constructor(kafka) {
    this.kafka = kafka;
    this.consumer = this.kafka.consumer({ groupId: "mail-group" });
    this.topic = process.env.KAFKA_MAIL_TOPIC || "mail-events";
  }

  async start() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: this.topic, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const data = JSON.parse(message.value.toString());
        console.log("[Kafka] Received mail event:", data);

        try {
          switch ((data.type || '').toUpperCase()) {
            case 'WELCOME':
              // delegate to service that actually sends email
              await mailService.sendWelcomeEmail({
                email: data.to,
                fullName: data.fullName,
                username: data.username
              });
              break;

            case 'OTP':
              await mailService.sendOTPEmail({
                email: data.to,
                fullName: data.fullName,
                username: data.username,
                otpCode: data.otpCode
              });
              break;

            default:
              // generic mail: mailService có method gửi mail chung
              if (mailService.sendGenericMail) {
                await mailService.sendGenericMail(data);
              } else {
                console.warn("[MailConsumer] Unhandled mail event type:", data.type);
              }
              break;
          }

          console.log("[MailConsumer] Processed mail event for:", data.to);
        } catch (err) {
          console.error("[MailConsumer] Error handling mail event:", err);
        }
      },
    });

    console.log("[Kafka] MailConsumer started");
  }
}

module.exports = MailConsumer;
