const expressAsyncHandler = require("express-async-handler");
const { Error } = require("mongoose");
const User = require("../../model/user/User");
const generateToken = require("../../config/token/generateToken");
const validateMongodbId = require("../../utils/validateMongodbId");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
const fs = require("fs");
sgMail.setApiKey(
  "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"
);
const cloudinaryUploadImg = require("../../utils/cloudinary");
const blockUser = require("../../utils/blockUser");
//________________________________
// user Register
//________________________________
const userRegisterCtrl = expressAsyncHandler(async (req, res) => {
  const userExists = await User.findOne({ email: req?.body?.email });
  if (userExists) {
    throw new Error("This user is exist");
  }
  try {
    // console.log(userExists);
    // console.log(req.body);
    const user = await User.create({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
    });
    res.json(user);
  } catch (err) {
    res.json(err);
  }
});

//________________________________
// user login
//________________________________
const loginUserCtrl = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const userFound = await User.findOne({ email });

  if (userFound && (await userFound.isPasswordMatch(password))) {
    res.json({
      _id: userFound?._id,
      firstName: userFound?.firstName,
      lastName: userFound?.lastName,
      email: userFound?.email,
      profilePhoto: userFound?.profilePhoto,
      isAdmin: userFound?.isAdmin,
      isVerified: userFound?.isAccountVerfied,
      token: generateToken(userFound._id), //*%$ -----------Token---------- *%$//
    });
  } else {
    res.status(401);
    throw new Error("check your email or your password");
  }
});

//________________________________
// fetch all users
//________________________________
const fetchUsers = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.find({}).populate("posts");
    res.json(users);
  } catch (err) {
    res.json(err);
  }
});

//________________________________
// delete user
//________________________________
const deleteUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json(deleteUser);
  } catch (err) {
    res.json(err);
  }
});

//________________________________
// fetch one user details
//________________________________

const fetchUserDetailsCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (err) {
    res.json(err);
  }
});

//________________________________
// user pofile
//________________________________

const userProfileCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;

  const loginUserId = req?.user?._id.toString();

  validateMongodbId(id);

  try {
    const myProfile = await User.findById(id)
      .populate("posts")
      .populate("ViewedBy");

    const alreadyViewed = myProfile?.ViewedBy?.find((user) => {
      return user?._id?.toString() === loginUserId;
    });

    const sameUser = id === loginUserId;

    if (alreadyViewed || sameUser) {
      return res.json(myProfile);
    }

    const userViewed = await User.findByIdAndUpdate(
      id,
      { $push: { ViewedBy: loginUserId } },
      {
        new: true,
      }
    ).populate("ViewedBy");
    res.json(userViewed);
  } catch (err) {
    res.json(err);
  }
});

//________________________________
// update pofile
//________________________________

const updateProdileCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req?.user;

  validateMongodbId(_id);
  blockUser(req?.user);
  const userUpdate = await User.findByIdAndUpdate(
    _id,
    {
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      bio: req?.body?.bio,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.json(userUpdate);
});

//________________________________
// change password
//________________________________

const updateUserPasswordCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);
  blockUser(req?.user);
  // req.body is an object
  const { password } = req.body;

  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updateUser = await user.save();
    res.json(updateUser);
  }
});

//________________________________
// follow user
//________________________________

const followUserCtrl = expressAsyncHandler(async (req, res) => {
  const followId = req?.body?.id;
  const loginId = req?.user?._id;
  blockUser(req?.user);

  console.log("follow:::", followId);
  console.log("login::::", loginId);

  const targetUser = await User.findById(followId);

  const alreadyExist = targetUser?.followers?.find((user) => {
    user?.toString() === loginId.toString() ? user : null;
    return user;
  });

  // console.log(alreadyExist);

  if (alreadyExist) throw new Error("your already follow this user");

  const followerUser = await User.findByIdAndUpdate(
    followId,
    {
      $push: { followers: loginId },
      isFollowing: true,
    },
    { new: true, runValidators: true }
  );

  const followingUser = await User.findByIdAndUpdate(
    loginId,
    {
      $push: { following: followId },
    },
    { new: true, runValidators: true }
  );

  res.json("you have successfully followed this user");
});

//________________________________
// unfollow user
//________________________________

const unfollowUserCtrl = expressAsyncHandler(async (req, res) => {
  const unfollowId = req?.body?.id;
  const loginId = req?.user?._id;

  blockUser(req?.user);

  await User.findByIdAndUpdate(
    unfollowId,
    { $pull: { followers: loginId }, isFollowing: false },
    { new: true }
  );
  await User.findByIdAndUpdate(
    loginId,
    { $pull: { following: unfollowId } },
    { new: true }
  );

  res.json("you have successfully unfollowed this user");
});

//________________________________
// block user
//________________________________

const blockUserCtrl = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongodbId(id);

  blockUser(req?.user);

  const user = await User.findByIdAndUpdate(
    id,
    { isBlocked: true },
    { new: true }
  );
  res.json(user);
});
//________________________________
// unBlock user
//________________________________

const unBlockUserCtrl = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  validateMongodbId(id);

  blockUser(req?.user);

  const user = await User.findByIdAndUpdate(
    id,
    { isBlocked: false },
    { new: true }
  );
  res.json(user);
});
//________________________________
// send mail (we use here sendgrid we want to learn about it)
// generate verify Email token this Ctrl is from video : 38 39 40
// %%%%%%%%%%% you need to rewatch it %%%%%%%%%%%%%%%%%%%%%%
//________________________________
const sendMailCtrl = expressAsyncHandler(async (req, res) => {
  const loginUserId = req?.user?._id;
  const user = await User.findById(loginUserId);
  blockUser(req?.user);
  // generate token
  const accountVerification = await user.createAccountVerificationToken();
  user.save();
  const resetURL = `if you were requested to verify your account, verify it now within 10 minutes , otherwise ignore this message <a href="http://localhost:1200/verify-account/${accountVerification}">verify here</a>`;

  try {
    const message = {
      to: user?.email,
      from: "mohamadkassem101@gmail.com",
      subject: "hello from Node.js",
      html: resetURL,
    };
    await sgMail.send(message);
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

//________________________________
// verify the Email
// generate verify Email token this Ctrl is from video : 38 39 40
// %%%%%%%%%%% you need to rewatch it %%%%%%%%%%%%%%%%%%%%%%
//________________________________

const accountVerificationCtrl = expressAsyncHandler(async (req, res) => {
  const { token } = req.body;

  blockUser(req?.user);

  const hashToken = crypto.createHash("sha256").update(token).digest("hex");
  console.log(hashToken);
  const userFound = await User.findOne({
    accountVerificationToken: token,
    accountVerificationTokenExpires: { $gt: new Date() },
  });

  if (!userFound) throw new Error("Token expired , try again later");

  userFound.accountVerificationToken = undefined;
  userFound.accountVerificationTokenExpires = undefined;
  userFound.isAccountVerfied = true;

  await userFound.save();
  res.json(userFound);
});

//________________________________
// forget password
//________________________________

const userForgetPasswordCtrl = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  blockUser(req?.user);
  if (!user) throw new Erorr("this user not found");

  const token = await user.resetForgetPasswordToken();
  user.save();
  const resetURL = `if you were requested to change your password, change it now within 10 minutes , otherwise ignore this message <a href="http://localhost:1200/reset-password/${token}">change password</a>`;
  try {
    const message = {
      to: "sydser2@gmail.com",
      from: "mohamadkassem101@gmail.com",
      subject: "Forget password",
      html: resetURL,
    };
    const resetUrl = await sgMail.send(message);
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

//________________________________
// reset new password was forget
//________________________________

const passwordResetCtrl = expressAsyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: new Date() + 1000 * 60 * 120 },
  });
  if (!user) throw new Error("Token expired , try again later");
  try {
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save();

    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

//________________________________
// pofile upload image
//________________________________

const profilePhotoUploadCtrl = expressAsyncHandler(async (req, res) => {
  // we have authMiddleware before this function in route , for that you can find the user with req.user

  const { _id } = req.user;

  blockUser(req?.user);

  //1.get the path to the img
  const localpath = `public/images/profile/${req.file.filename}`;
  //2. to upload to cloudinary
  const imgUploaded = await cloudinaryUploadImg(localpath);

  const foundUser = await User.findByIdAndUpdate(
    _id,
    {
      profilePhoto: imgUploaded.url,
    },
    {
      new: true,
    }
  );

  fs.unlinkSync(localpath);
  res.json(imgUploaded);
});

module.exports = {
  userRegisterCtrl,
  loginUserCtrl,
  fetchUsers,
  deleteUserCtrl,
  fetchUserDetailsCtrl,
  userProfileCtrl,
  updateProdileCtrl,
  updateUserPasswordCtrl,
  followUserCtrl,
  unfollowUserCtrl,
  blockUserCtrl,
  unBlockUserCtrl,
  sendMailCtrl,
  accountVerificationCtrl,
  userForgetPasswordCtrl,
  passwordResetCtrl,
  profilePhotoUploadCtrl,
};
