import nodemailer from "nodemailer";

interface SendEmailInput {
  email: string;
  code: string;
  type?: "verification" | "reset";
}

export const sendVerificationEmail = async ({ email, code, type = "verification" }: SendEmailInput): Promise<boolean> => {
  const from = `"Ekushey 71 Sangbad Admin" <${process.env.EMAIL_USER}>`;
  const subject = type === "reset" ? "Password reset code" : "Your verification code";
  const text = `${subject}\n\nYour code is ${code}\n\nThis code will expire in 10 minutes.`;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT || 587),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from,
      to: email,
      subject,
      text,
    });
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
};
