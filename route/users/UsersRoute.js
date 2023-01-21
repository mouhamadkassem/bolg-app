const express = require("express");
const userRoutes = express.Router();
const {
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
  addAdmin,
} = require("../../controllers/users/UserCtrl");
const authMiddleware = require("../../middlewars/auth/authMiddlewars");
const {
  photoUpload,
  profilePhotoResize,
} = require("../../middlewars/uploads/photoUpload");

userRoutes.post("/register", userRegisterCtrl);
userRoutes.post("/login", loginUserCtrl);
userRoutes.post("/generate-verify-email-token", authMiddleware, sendMailCtrl);
userRoutes.get("/", fetchUsers);
userRoutes.delete("/:id", deleteUserCtrl);
userRoutes.get("/:id", fetchUserDetailsCtrl);
userRoutes.get("/profile/:id", authMiddleware, userProfileCtrl);
userRoutes.put("/follow", authMiddleware, followUserCtrl);
userRoutes.post("/verify-account", accountVerificationCtrl);
userRoutes.put("/block-user/:id", authMiddleware, blockUserCtrl);
userRoutes.put("/unblock-user/:id", authMiddleware, unBlockUserCtrl);
userRoutes.put("/follow", authMiddleware, followUserCtrl);
userRoutes.put("/unfollow", authMiddleware, unfollowUserCtrl);
userRoutes.put("/password", authMiddleware, updateUserPasswordCtrl);

userRoutes.put(
  "/pofileUpload-image",
  authMiddleware,
  photoUpload.single("image"),
  profilePhotoResize,
  profilePhotoUploadCtrl
);
userRoutes.post("/forget-password", userForgetPasswordCtrl);
userRoutes.put("/reset-password", passwordResetCtrl);
userRoutes.put("/", authMiddleware, updateProdileCtrl);

module.exports = userRoutes;
