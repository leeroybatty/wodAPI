import nodemailer from "nodemailer";
import { requireEnvVar } from "@logger/envcheck";
import { logger } from "@logger";

let transporter = nodemailer.createTransport({
  host: requireEnvVar('EMAIL_SERVER'),
  port: 587,
  secure: false,
  auth: {
    user: requireEnvVar('EMAIL_USER'),
    pass: requireEnvVar('EMAIL_PASSWORD'),
  }
});

export const sendSingleEmail = async function(
  recipient: string,
  subject: string,
  bodyAsText: string
): Promise<void> {

   let mailOptions = {
    from: `"${requireEnvVar('GAME_NAME')}" <${requireEnvVar('EMAIL_ADDRESS')}>`,
    to: recipient,
    subject,
    text: bodyAsText
  }

  try {
    const sendAttempt = await transporter.sendMail(mailOptions);
    logger.log(`Message sent: - ${sendAttempt.messageId}`);
  } catch (error) {
    logger.error(error as Error);
  }
}
