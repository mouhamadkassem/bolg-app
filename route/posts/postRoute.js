const express = require("express");
const postRoutes = express.Router();
const {
  postPhotoResize,
  photoUpload,
} = require("../../middlewars/uploads/photoUpload");
const authMiddleware = require("../../middlewars/auth/authMiddlewars");

const {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  updatePostCtrl,
  deletePostCtrl,
  postLikeAndToggoleIfDislike,
  postDisLikeAndToggoleIfLike,
} = require("../../controllers/posts/postCtrl");

postRoutes.post(
  "/",
  authMiddleware,
  photoUpload.single("image"),
  postPhotoResize,
  createPostCtrl
);
postRoutes.get("/", fetchPostsCtrl);
postRoutes.get("/:id", fetchPostCtrl);
postRoutes.delete("/:id", authMiddleware, deletePostCtrl);
postRoutes.put("/like", authMiddleware, postLikeAndToggoleIfDislike);
postRoutes.put("/dislike", authMiddleware, postDisLikeAndToggoleIfLike);
postRoutes.put("/:id", authMiddleware, updatePostCtrl);

module.exports = postRoutes;
