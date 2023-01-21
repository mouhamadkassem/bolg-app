const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "the title is require"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "the category is require"],
    },
    isLike: {
      type: Boolean,
      default: false,
    },
    isDisLike: {
      type: Boolean,
      default: false,
    },
    numViews: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    disLikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "please Author is required"],
    },
    description: {
      type: String,
      required: [true, "Post description is required"],
    },
    image: {
      type: String,
      default:
        "https://pixabay.com/photos/profile-beach-teenager-potrait-boy-7579739/",
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

/////////////////////////////////////
//populate the comment into post
//??? you want to understand that ??????????????????????????????????????????//
postSchema.virtual("comment", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});

//  compile schema into model

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
