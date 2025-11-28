import mongoose from "mongoose";

export const genderEnum = {
  MALE: "MALE",
  FEMALE: "FEMALE",
};
export const providerEnum = {
  SYSTEM: "SYSTEM",
  GOOGLE: "GOOGLE",
};

export const roleEnum = {
  USER: "USER",
  ADMIN: "ADMIN",
};

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "First name must be at least 3 characters long"],
      maxLength: [20, "First name must be at most 20 characters long"],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Last name must be at least 3 characters long"],
      maxLength: [20, "Last name must be at most 20 characters long"],
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
      trim: true,
      required: function () {
        return providerEnum.GOOGLE ? false : true;
      },
    },
    gender: {
      type: String,
      enum: {
        values: Object.values(genderEnum),
        message: "{VALUE} is not valid",
      },
      default: genderEnum.MALE,
    },
    providers: {
      type: String,
      enum: {
        values: Object.values(providerEnum),
        message: "{VALUE} is not valid",
      },
      default: providerEnum.SYSTEM,
    },
    role: {
      type: String,
      enum: {
        values: Object.values(roleEnum),
        message: "{VALUE} is not valid role",
      },
      default: roleEnum.USER,
    },
    phone: String,
    profileImage: String,
    coverImages: [String],
    cloudProfileImage: { public_id: String, secure_url: String },
    cloudCoverImages: [{ public_id: String, secure_url: String }],
    // freezing fields
    freezedAt: Date,
    freezedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restoredFromFreezedAt: Date,
    restoredFromFreezedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // soft delete fields
    isDeleted: { type: Boolean, default: false },
    deletedAt: {
      type: Date,
      index: {
        expireAfterSeconds: 60 * 60 * 24 * 30, // 30 days
      },
    },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restoredFromDeletedAt: Date,
    restoredFromDeletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    confirmEmail: Date,
    confirmEmailOTP: String,
    forgetPasswordOTP: { code: { type: String }, expiresAt: { type: Date } },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.virtual("messages", {
  localField: "_id",
  foreignField: "receiverId",
  ref: "Message",
});

const UserModel = mongoose.model.User || mongoose.model("User", userSchema);

export default UserModel;
