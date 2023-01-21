const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // this package is to hash password
const crypto = require("crypto");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    profilePhoto: {
      type: String,
      default:
        "https://www.bing.com/th?id=OIP.mDv826UG65YB8vFcW1SB3QHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    bio: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    postCount: {
      type: Number,
      default: 0,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["Admin", "Guest", "Blogger"],
    },
    isFollowing: {
      type: Boolean,
      default: false,
    },
    isUnFollowing: {
      type: Boolean,
      default: false,
    },
    isAccountVerfied: {
      type: Boolean,
      default: false,
    },
    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,
    ViewedBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    followers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    following: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

///////////////////////////////////////////////////////////
// virtual posts
userSchema.virtual("posts", {
  ref: "Post",
  foreignField: "user",
  localField: "_id",
});

///////////////////////////////////////////////////////////
//virtual type Acount
userSchema.virtual("accountType").get(function () {
  return this.followers?.length >= 1 ? "Pro Account" : "Starter Account";
});

///////////////////////////////////////////////////////////
// match passworda
userSchema.methods.isPasswordMatch = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

///////////////////////////////////////////////////////////
//verify account token
userSchema.methods.createAccountVerificationToken = async function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  this.accountVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  this.accountVerificationTokenExpires = Date.now() + 1000 * 60 * 140;
  return verificationToken;
};

///////////////////////////////////////////////////////////
// reset password token
userSchema.methods.resetForgetPasswordToken = async function () {
  const resetPasswordToken = crypto.randomBytes(32).toString("hex");
  console.log(resetPasswordToken);
  console.log(
    crypto.createHash("sha256").update(resetPasswordToken).digest("hex")
  );
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetPasswordToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 1000 * 60 * 130;
  // return resetPasswordToken;
};

// understand this logic //////////////////////////////////=>
///////////////////////////////////////////////////////////
// hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
///////////////////////////////////////////////////////////

// compile schema into model

const User = mongoose.model("User", userSchema);

module.exports = User;
