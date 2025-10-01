const nodemailer = require("nodemailer");

class MailService {
  static transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  static async sendMail({ to, subject, text, html }) {
    return this.transporter.sendMail({
      from: `"My App" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      html
    });
  }

  static async sendWelcomeEmail(user) {
    const subject = "🎉 Cảm ơn bạn đã đăng ký My App!";
    const text = `Xin chào ${user.fullName || user.username}, cảm ơn bạn đã đăng ký dịch vụ của chúng tôi.`;

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f7;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <h2 style="color: #4CAF50; text-align: center;">Xin chào ${user.fullName || user.username},</h2>
          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            Cảm ơn bạn đã đăng ký dịch vụ của <b>My App</b>.  
            Chúng tôi rất vui mừng được đồng hành cùng bạn!
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://myapp.com" 
               style="background: #4CAF50; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-size: 16px;">
              Truy cập ngay
            </a>
          </div>

          <p style="font-size: 14px; color: #777; text-align: center;">
            Nếu bạn có bất kỳ thắc mắc nào, hãy liên hệ với chúng tôi qua email 
            <a href="mailto:support@myapp.com">support@myapp.com</a>.
          </p>

          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #aaa; text-align: center;">
            Đây là email tự động, vui lòng không trả lời.
          </p>
        </div>
      </div>
    `;

    return this.sendMail({ to: user.email, subject, text, html });
  }
}

module.exports = MailService;
