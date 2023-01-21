const Post = require("../../model/post/post");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../../utils/validateMongodbId");
const Filter = require("bad-words");
const User = require("../../model/user/User");
const cloudinaryUploadImg = require("../../utils/cloudinary");
const fs = require("fs");
const blockUser = require("../../utils/blockUser");

//________________________________
// create post
//________________________________
const createPostCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;

  blockUser(req?.user);

  // validateMongodbId(req.body.user);
  const filter = new Filter();
  const isProfane = filter.isProfane(req.body.title, req.body.description);

  if (isProfane) {
    await User.findByIdAndUpdate(_id, {
      isBlocked: true,
    });
    throw new Error(
      "Creating Failed because it contains profane words and you have been blocked"
    );
  }

  //1.get the path to the img
  const localpath = `public/images/posts/${req.file.filename}`;
  //2. to upload to cloudinary
  const imgUploaded = await cloudinaryUploadImg(localpath);

  if (req.user.postCount === 2 && req.user.accountType === "Starter Account")
    throw new Error(
      "Starter Account can add only two post , get more followers"
    );
  try {
    const post = await Post.create({
      ...req.body,
      image: imgUploaded?.url,
      user: _id,
    });

    await User.findByIdAndUpdate(
      _id,
      {
        $inc: { postCount: 1 },
      },
      { new: true }
    );

    res.json(post);
    fs.unlinkSync(localpath);
  } catch (error) {
    res.json(error);
  }
});

//________________________________
// fetch all posts
//________________________________

const fetchPostsCtrl = expressAsyncHandler(async (req, res) => {
  const filterDb = req?.query?.category;

  try {
    if (filterDb) {
      const posts = await Post.find({ category: filterDb })
        .populate("user")
        .populate("comment");
      res.json(posts);
    } else if (!filterDb) {
      const posts = await Post.find({}).populate("user").populate("comment");
      res.json(posts);
    }
  } catch (err) {
    res.json(err);
  }
});

//________________________________
// fetch a single post
//________________________________

const fetchPostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const post = await Post.findById(id)
      .populate("user")
      .populate("disLikes")
      .populate("likes")
      .populate("comment");

    await Post.findByIdAndUpdate(
      id,
      {
        $inc: {
          numViews: 1,
        },
      },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//________________________________
// update post
//________________________________

const updatePostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  blockUser(req?.user);
  try {
    const update = await Post.findByIdAndUpdate(
      id,
      {
        ...req.body,
        user: req?.user?.id,
      },
      {
        new: true,
      }
    );
    res.json(update);
  } catch (error) {
    res.json(error);
  }
});

//________________________________
// delete post
//________________________________
const deletePostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deletePost = await Post.findByIdAndDelete(id);
    res.json(deletePost);
  } catch (error) {
    res.json(error);
  }
});

//________________________________
// like post
//________________________________

const postLikeAndToggoleIfDislike = expressAsyncHandler(async (req, res) => {
  const { postId } = req.body;
  const loginUserId = req.user._id;
  blockUser(req?.user);

  const post = await Post.findById(postId);

  const isLiked = post?.isLike;

  const alreadyDislike = post.disLikes.find(
    (userId) => userId.toString() === loginUserId.toString()
  );

  if (alreadyDislike) {
    await Post.findByIdAndUpdate(
      postId,
      {
        $pull: {
          dislikes: loginUserId,
        },
        isDisLike: false,
      },
      {
        new: true,
      }
    );
  }

  if (isLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLike: false,
      },
      { new: true }
    );
    res.json(post);
  } else {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          likes: loginUserId,
        },
        isLike: true,
      },
      {
        new: true,
      }
    );

    res.json(post);
  }
});

//________________________________
// dislike post
//________________________________

const postDisLikeAndToggoleIfLike = expressAsyncHandler(async (req, res) => {
  const { postId } = req.body;
  const loginUserId = req.user._id;
  blockUser(req?.user);

  const post = await Post.findById(postId);

  const isDisLiked = post.isDisLike;
  const alreadyLike = post.likes.find(
    (userId) => userId.toString() === loginUserId.toString()
  );

  if (alreadyLike) {
    await Post.findByIdAndUpdate(
      postId,
      {
        $pull: {
          likes: loginUserId,
        },
        isLike: false,
      },
      { new: true }
    );
  }

  if (isDisLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: {
          disLikes: loginUserId,
        },
        isDisLike: false,
      },
      {
        new: true,
      }
    );
    res.json(post);
  } else {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          disLikes: loginUserId,
        },
        isDisLike: true,
      },
      {
        new: true,
      }
    );
    res.json(post);
  }
});

module.exports = {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  updatePostCtrl,
  deletePostCtrl,
  postLikeAndToggoleIfDislike,
  postDisLikeAndToggoleIfLike,
};
