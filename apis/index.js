import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import albumRoutes from "./routes/album.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";


dotenv.config();

mongoose.connect(process.env.MONGO)
.then(() => {
  console.log("Connected to MongoDB!");
}).catch(err => {
  console.error("Failed to connect to MongoDB", err);
});

const __dirname = path.resolve();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server listening on port 3000!");
});

app.use("/apis/user", userRoutes);
app.use("/apis/auth", authRoutes);
app.use("/apis/post", postRoutes);
app.use("/apis/comment", commentRoutes);
app.use("/apis/album", albumRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get ("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ 
    success: false,
    statusCode,
    message,
  });    
});