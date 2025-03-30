import nodemailer from "nodemailer";
import { User } from "@/models/users.models";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    const url = `${process.env.DOMAIN}/${
      emailType == "VERIFY" ? "verifyemail" : "reset-password"
    }?token=${hashedToken}`;

    const user = await User.findByIdAndUpdate(userId, {
      $set:
        emailType === "VERIFY"
          ? {
              verifyToken: hashedToken,
              verifyTokenExpiry: Date.now() + 3600000,
            }
          : {
              forgotPasswordToken: hashedToken,
              forgotPasswordTokenExpiry: Date.now() + 3600000,
            },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const mailOptions = {
      from: "krishkalola@outlook.com",
      to: email,
      subject: `Your ${emailType} link`,
      html: `<p>Click <a href="${url}">here</a> to ${emailType == "VERIFY"? "verify your email": "forgot your password"}</p>`,
    };

    console.log("Mail options:", mailOptions);

    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const response = await transport.sendMail(mailOptions);

    if (!response) {
      throw new Error("Error sending email");
    }

    return {
      status: 200,
      message: `Email sent successfully to ${email}`,
    };
  } catch (error: any) {
    throw new Error(`Error sending email: ${error.message}`);
  }
};
