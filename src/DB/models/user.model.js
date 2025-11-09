import mongoose from "mongoose";

export const genderEnum = {
  MALE: "MALE",
  FEMALE: "FEMALE",
};
export const providerEnum = {
  SYSTEM: "SYSTEM",
  GOOGLE: "GOOGLE",
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
    phone: String,
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
