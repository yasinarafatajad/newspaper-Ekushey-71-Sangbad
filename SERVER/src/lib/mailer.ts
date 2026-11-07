import nodemailer from "nodemailer";

interface SendEmailInput {
  email: string;
  code: string;
  type?: "verification" | "reset";
}

// Keep in sync with RESET_CODE_TTL_MS in authControllers.
const CODE_TTL_MINUTES = 5;

const BRAND = "Ekushey 71 Sangbad";

const buildHtml = ({
  subject,
  label,
  heading,
  intro,
  code,
  preheader,
}: {
  subject: string;
  label: string;
  heading: string;
  intro: string;
  code: string;
  preheader: string;
}) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f2eee6;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2eee6;">
<tr><td align="center" style="padding:36px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:6px;overflow:hidden;box-shadow:0 12px 32px rgba(14,21,33,0.10);">
<tr><td style="height:4px;background-color:#c6a15b;font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td style="background-color:#0e1521;padding:34px 40px;text-align:center;">
<p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:20px;letter-spacing:4px;color:#f6f2ea;text-transform:uppercase;">${BRAND}</p>
<p style="margin:9px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:3px;color:#c6a15b;text-transform:uppercase;">Admin Console</p>
</td></tr>
<tr><td style="padding:40px 40px 0;">
<p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2px;color:#a08a5c;text-transform:uppercase;">${label}</p>
<h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.3;font-weight:normal;color:#0e1521;">${heading}</h1>
<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#4a4638;">${intro}</p>
</td></tr>
<tr><td style="padding:28px 40px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td align="center" style="border:1px dashed #c6a15b;border-radius:4px;background-color:#faf7f1;padding:26px 12px;">
<p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:2px;color:#8a7a5a;text-transform:uppercase;">Your one-time code</p>
<p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:38px;line-height:1.2;letter-spacing:12px;color:#0e1521;font-weight:bold;">${code}</p>
</td></tr>
</table>
</td></tr>
<tr><td align="center" style="padding:16px 40px 0;">
<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b6656;">This code expires in <strong style="color:#0e1521;">${CODE_TTL_MINUTES} minutes</strong>.</p>
</td></tr>
<tr><td style="padding:32px 40px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="height:1px;background-color:#eae4d8;font-size:0;line-height:0;">&nbsp;</td></tr>
</table>
</td></tr>
<tr><td style="padding:24px 40px 0;">
<p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.7;color:#6b6656;">If you didn't request this code, you can safely ignore this email \u2014 your password will stay the same.</p>
<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.7;color:#6b6656;">For your security, never share this code with anyone. Our team will never ask you for it.</p>
</td></tr>
<tr><td style="padding:28px 40px 0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="height:1px;background-color:#eae4d8;font-size:0;line-height:0;">&nbsp;</td></tr>
</table>
</td></tr>
<tr><td style="background-color:#0e1521;padding:26px 40px;text-align:center;">
<p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:13px;letter-spacing:2px;color:#f6f2ea;text-transform:uppercase;">${BRAND}</p>
<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.7;color:#8f97a3;">This is an automated message \u2014 please do not reply.<br />&copy; ${new Date().getFullYear()} ${BRAND}. All rights reserved.</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

export const sendVerificationEmail = async ({ email, code, type = "verification" }: SendEmailInput): Promise<boolean> => {
  const user = process.env.EMAIL_USER?.trim();
  // Gmail app passwords are displayed with spaces; 
  const pass = process.env.EMAIL_PASS?.replace(/\s+/g, "");

  if (!user || !pass) {
    console.error("Missing EMAIL_USER or EMAIL_PASS in .env");
    return false;
  }

  const from = `"${BRAND}" <${user}>`;
  const isReset = type === "reset";
  const subject = isReset ? "Reset your password" : "Your verification code";
  const heading = isReset ? "Reset your password" : "Verify your email address";
  const intro = isReset
    ? "We received a request to reset the password for your admin account. Enter the code below to continue."
    : "Use the code below to complete your verification.";
  const label = isReset ? "Password reset" : "Account verification";

  const text = `${BRAND} \u2014 Admin Console\n\n${heading}\n\n${intro}\n\nYour one-time code: ${code}\n\nThis code expires in ${CODE_TTL_MINUTES} minutes.\n\nIf you didn't request this, you can safely ignore this email. Never share this code with anyone.\n\nThis is an automated message \u2014 please do not reply.`;
  const html = buildHtml({
    subject,
    label,
    heading,
    intro,
    code,
    preheader: `Your ${BRAND} code is ${code} \u2014 it expires in ${CODE_TTL_MINUTES} minutes.`,
  });

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT || 587),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user,
      pass,
    },
  });

  try {
    await transporter.sendMail({
      from,
      to: email,
      subject,
      text,
      html,
    });
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
};
