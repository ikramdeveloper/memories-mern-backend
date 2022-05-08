import express from "express";
const router = express.Router();

import {
  getPosts,
  getPostsBySearch,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
} from "../controllers/posts.controllers.js";
import auth from "../middlewares/auth.middleware.js";

router.get("/", getPosts);
router.get("/search", getPostsBySearch);
router.get("/:id", getPostById);
router.post("/", auth, createPost);
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.patch("/:id/likePost", auth, likePost);

export default router;
