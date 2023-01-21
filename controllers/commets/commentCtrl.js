const Comment = require("../../model/comment/Comment");
const expressAsyncHandler = require("express-async-handler");
const validateMongobdId = require("../../utils/validateMongodbId");
const blockUser = require("../../utils/blockUser");
//________________________________
// create comment
//________________________________

const createCommentCtrl = expressAsyncHandler(async (req, res) => {
  const user = req.user;
  const { postId, description } = req.body;
  blockUser(req?.user);

  try {
    console.log("start");
    const comment = await Comment.create({
      post: postId,
      user: user,
      description,
    });
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//________________________________
// fetch all comments
//________________________________

const fetchAllCommentCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const comments = await Comment.find({}).sort("-create").populate("user");
    res.json(comments);
  } catch (error) {
    res.json(error);
  }
});

//________________________________
// fetch comment
//________________________________

const fetchCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongobdId(id);

  try {
    const comment = await Comment.findById(id).populate("user");
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//________________________________
// update comment
//________________________________

const updateCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongobdId(id);
  blockUser(req?.user);

  try {
    const comment = await Comment.findByIdAndUpdate(
      id,
      {
        description: req?.body?.description,
      },
      {
        new: true,
      }
    );
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

//________________________________
// update comment
//________________________________

const deleteCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongobdId(id);
  blockUser(req?.user);
  try {
    const commentDel = await Comment.findByIdAndDelete(id);
    res.json(commentDel);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createCommentCtrl,
  fetchAllCommentCtrl,
  fetchCommentCtrl,
  updateCommentCtrl,
  deleteCommentCtrl,
};
