const express = require("express");
const commentRoutes = express.Router();
const authMiddlewars = require("../../middlewars/auth/authMiddlewars");
const {
  createCommentCtrl,
  fetchAllCommentCtrl,
  fetchCommentCtrl,
  updateCommentCtrl,
  deleteCommentCtrl,
} = require("../../controllers/commets/commentCtrl");

commentRoutes.post("/", authMiddlewars, createCommentCtrl);
commentRoutes.get("/", authMiddlewars, fetchAllCommentCtrl);
commentRoutes.get("/:id", authMiddlewars, fetchCommentCtrl);
commentRoutes.put("/:id", authMiddlewars, updateCommentCtrl);
commentRoutes.delete("/:id", authMiddlewars, deleteCommentCtrl);

module.exports = commentRoutes;
