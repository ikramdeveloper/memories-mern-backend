import mongoose from "mongoose";
import Post from "../models/posts.models.js";

const getPosts = async (req, resp) => {
  const { page } = req.query;
  const LIMIT = 8;
  const startIndex = (Number(page) - 1) * LIMIT;
  try {
    const total = await Post.countDocuments({});

    const posts = await Post.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);
    const finalResult = {
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    };
    resp.status(200).json(finalResult);
  } catch (err) {
    resp.status(404).json({ message: err.message });
  }
};

const getPostsBySearch = async (req, resp) => {
  const { searchQuery, tags } = req.query;
  try {
    const title = new RegExp(searchQuery, "i");
    const result = await Post.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });
    resp.json({ data: result });
  } catch (err) {
    resp.status(404).json({ message: err.message });
  }
};

const getPostById = async (req, resp) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    resp.status(200).json(post);
  } catch (err) {
    resp.status(404).json({ message: err });
  }
};

const createPost = async (req, resp) => {
  const data = req.body;

  const newPost = new Post({
    ...data,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });
  try {
    await newPost.save();
    resp.status(201).json(newPost);
  } catch (err) {
    resp.status(409).json({ message: err.message });
  }
};

const updatePost = async (req, resp) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return resp.status(404).json({ message: "No post found" });

  try {
    const updatedPost = await Post.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    resp.json(updatedPost);
  } catch (err) {
    resp.status(409).json({ message: err.message });
  }
};

const deletePost = async (req, resp) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return resp.status(404).json({ message: "No post found" });

  try {
    const deletedPost = await Post.findByIdAndDelete(_id);
    resp.json(deletedPost);
  } catch (err) {
    resp.status(409).json({ message: err.message });
  }
};

const likePost = async (req, resp) => {
  const { id: _id } = req.params;

  if (!req.userId)
    return resp.status(401).json({ message: "Not authenticated" });

  if (!mongoose.Types.ObjectId.isValid(_id))
    return resp.status(404).json({ message: "No post found" });

  try {
    const post = await Post.findById(_id);
    const index = post.likes.findIndex((id) => id === String(req.userId));
    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await Post.findByIdAndUpdate(_id, post, { new: true });
    resp.json(updatedPost);
  } catch (err) {
    resp.status(409).json({ message: err.message });
  }
};
export {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPostsBySearch,
};
