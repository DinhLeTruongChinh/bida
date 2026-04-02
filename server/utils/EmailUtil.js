// CLI: npm install nodemailer --save
const nodemailer = require('nodemailer');
const MyConstants = require('./MyConstants');

const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: MyConstants.EMAIL_USER,
    pass: MyConstants.EMAIL_PASS
  }
});

const EmailUtil = {
  async send(email, id, token) {
    const text =
      "Thanks for signing up. Please use these information to activate your account:\n" +
      "id: " + id + "\n" +
      "token: " + token;

    const mailOptions = {
      from: MyConstants.EMAIL_USER,
      to: email,
      subject: "Signup | Verification",
      text: text
    };

    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      console.log("Email error:", err);
      return false;
    }
  }
};

module.exports = EmailUtil;