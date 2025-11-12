class MailProducer {
  constructor(kafka) {
    this.producer = kafka.producer();
  }

  async connect() {
    await this.producer.connect();
    console.log("[Kafka] MailProducer connected");
  }

  /**
   * Gửi event mail tổng quát (dùng cho mọi loại email)
   */
  async sendMailEvent(data) {
    if (!data.to) {
      console.error("[Kafka] Không có người nhận email (to) trong payload:", data);
      return;
    }

    await this.producer.send({
      topic: "mail-events",
      messages: [{ value: JSON.stringify(data) }],
    });

    console.log(`[Kafka] Mail event sent to ${data.to} (${data.type || "general"})`);
  }

  /**
   * Gửi email chào mừng khi user mới đăng ký
   */
  async sendWelcomeEmail(user) {
    const event = {
      type: "WELCOME",
      to: user.email,
      fullName: user.fullName,
      username: user.username,
    };

    await this.sendMailEvent(event);
  }

  /**
   * 🔐 Gửi email chứa mã OTP (quên mật khẩu, xác thực, v.v.)
   */
  async sendOTPEmail(user, otpCode) {
    const event = {
      type: "OTP",
      to: user.email,
      fullName: user.fullName,
      username: user.username,
      otpCode,
    };

    await this.sendMailEvent(event);
  }
}

module.exports = MailProducer;
