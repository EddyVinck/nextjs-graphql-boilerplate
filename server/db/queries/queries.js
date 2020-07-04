const { Post } = require("../resources/post/post.model");

const postByTitle = (title) => {
  return Post.findOne({ title }).exec();
};

// skip and limit are used for pagination
const postsForAuthor = (userId, skip = 0, limit = 10) => {
  return Post.find({ author: userId }).skip(skip).limit(limit).exec();
};

const getAuthorFromPost = async (postId) => {
  const match = await Post.findById(postId)
    .populate("author")
    .select("author")
    .exec();

  return match.author;
};

const fullPostById = (id) => {
  return Post.findById(id).populate("author").exec();
};

const allPostsSlim = (fieldsToSelect, skip = 0, limit = 10) => {
  return Post.find({}).skip(skip).limit(limit).select(fieldsToSelect).exec();
};

const postByContentLength = (maxContentLength, minContentLength) => {
  return Post.find({
    contentLength: {
      $gt: minContentLength, // inclusive would be $gte
      $lt: maxContentLength, // or $lte for "less than or equal to".
    },
  }).exec();
};

module.exports = { postsForAuthor, getAuthorFromPost };
