import { Request, Response, RequestHandler } from "express";
import { hashPassword, comparePasswords } from "./services";
import User from "@v1/users/model";
import { handleServerError, sendErrorResponse, sendSuccessResponse } from "@utils/responseUtils";
import { validateFields } from "@utils/fieldValidationUtils";
import { generateTokens, verifyToken } from "@utils/tokenUtils";
import crypto from "crypto";
import { sendEmail } from "@utils/mailer";
import { log } from "console";

export const registerUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { username, email, password, fullName } = req.body;

    const error = validateFields(req.body, {
      required: ["username", "email", "password", "fullName"],
    });

    if (!error.valid) {
      sendErrorResponse(res, "", error.error, 400);
      return;
    }


    if (!req.file) {
      res.status(400).json({ message: "Image file is required." });
      return;
    }
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imagePath = `${baseUrl}/static/${req.file.filename}`;
    // const imagePath = `/uploads/${req.file.filename}`;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      res.status(400).json({
        message: "Username or email already in use.",
      });
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      fullName,
      image_url: imagePath,
    });

    // Save the user to the database
    await user.save();

    const payload: Partial<typeof user> = { ...user.toObject() };
    delete payload.password;

    const { accessToken, refreshToken } = generateTokens(payload);

    // Return success response
    res.status(201).json({
      message: "User registered successfully.",
      user: payload,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

export const loginUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, username, password } = req.body;
    if (email && username) {
      sendErrorResponse(
        res,
        "Provide either email or username, not both",
        null,
        400
      );
      return;
    }
    if (!email && !username) {
      sendErrorResponse(res, "Provide either email or username", null, 400);
      return;
    }

    if (!password) {
      sendErrorResponse(res, "Password is required", null, 400);
      return;
    }

    const user = await User.findOne(email ? { email } : { username });
    if (!user) {
      sendErrorResponse(res, "Invalid credentials", null, 401);
      return;
    }

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      sendErrorResponse(res, "Invalid credentials", null, 401);
      return;
    }

    const payload: Partial<typeof user> = { ...user.toObject() };
    delete payload.password;

    const { accessToken, refreshToken } = generateTokens(payload);

    res
      .status(200)
      .json({
        message: "Login successful",
        user: payload,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    handleServerError(res, error);
  }
};

export const forgotPassword: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User with this email does not exist" });
      return;
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    user.resetPasswordToken = otp;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiration
    await user.save();

    const mailOptions = {
      to: email,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p style="font-size: 16px; line-height: 1.5;">
            Hello,<br>
            You requested a password reset. Use the code below to reset your password:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #007BFF;">${otp}</span>
          </div>
          <p style="font-size: 16px; line-height: 1.5;">
            If you did not request this, please ignore this email or contact support.
          </p>
          <p style="font-size: 14px; color: #555;">
            Thank you,<br>
            <strong>Deccession Team</strong>
          </p>
        </div>
      `,
    };
    await sendEmail(mailOptions);

    res.status(200).json({ message: "Password reset code sent to your email" });
  } catch (error: any) {
    handleServerError(res, error);
  }
};

export const resetPassword: RequestHandler = async (req, res) => {
  try {
    const { otp, password, confirmPassword } = req.body;

    const error = validateFields(req.body, {
      required: ["otp", "password", "confirmPassword"],
    });

    if (password !== confirmPassword) {
      res.status(400).json({ message: "Passwords do not match" });
      return;
    }

    const user = await User.findOne({
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }

    user.password = await hashPassword(password);
    user.resetPasswordToken = undefined; // Invalidate token
    user.resetPasswordExpires = undefined; // Remove expiration
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    handleServerError(res, error);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token is required" });
      return;
    }

    // Verify the refresh token
    const payload = verifyToken(refreshToken, "refresh");
    if (!payload) {
      res.status(401).json({ message: "Invalid or expired refresh token" });
      return;
    }

    delete payload.iat;
    delete payload.exp;


    const accessToken = generateTokens(payload);

    sendSuccessResponse(res, "Token refreshed successfully", {
      ...accessToken,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};