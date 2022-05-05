import express from "express";
const router = express.Router();

import { loginUser, signUpUser } from "../controllers/users.controllers.js";

router.post("/login", loginUser);
router.post("/signup", signUpUser);

export default router;
