import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import postsRoutes from "./routes/posts.routes.js";
import usersRoutes from "./routes/users.routes.js";

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const PORT = process.env.PORT || 3001;
const CONNECTION_URL = process.env.MONGODB_URI;

app.get("/", (req, resp) => {
  resp.send("Hello from memories mern backend");
});
app.use("/posts", postsRoutes);
app.use("/users", usersRoutes);

mongoose
  .connect(CONNECTION_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`listening on port ${PORT}...`));
  })
  .catch((err) => console.error(err));
