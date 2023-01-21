const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "the post is required"],
      ref: "Post",
    },
    user: {
      type: Object,
      required: [true, "the user is required"],
      ref: "User",
    },
    description: {
      type: String,
      required: [true, "the description is required"],
    },
  },
  {
    timestamps: true,
  }
);

/////////////////////////////////////
// compile schema into model

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
