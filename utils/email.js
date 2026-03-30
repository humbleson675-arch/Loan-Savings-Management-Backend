import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export const sendVerificationEmail = async (email) => {
  try {
    // 1️⃣ Create token for verification
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // 2️⃣ Create verification link BEFORE using it
    const verificationLink = `http://localhost:8080/api/users/verify/${token}`;

    // 3️⃣ Configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    // 4️⃣ Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `
        <p>Thank you for registering!</p>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationLink}">Verify Email</a>
      `,
    });

    console.log("Verification email sent to", email);
  } catch (error) {
    console.error("Email Error:", error);
    throw error;
  }
};