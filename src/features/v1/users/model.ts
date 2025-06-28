import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  fullName: string;
  image_url: { type: String },
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  role : string;
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    image_url: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);