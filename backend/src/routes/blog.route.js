import express from "express"
import Blog from "../models/blog.model.js"
import * as BlogController from "../controllers/blog.controller.js"
import verifyToken from "../middleware/verifyToken.js";
import isAdmin from "../middleware/isAdmin.js";
const router = express.Router();

//get all blogs
router.get("/", BlogController.getAllBlogs)

//create a blog post
router.post("/create-post", verifyToken, isAdmin, BlogController.createBlog) //chỉ có admin mới được post. Hàm next() dùng để thực hiện hàm tiếp theo

//get single blog by id
router.get("/:id", BlogController.getBLog)

//Update blog
router.patch("/update-post/:id", verifyToken, BlogController.updateBlog);

//Delete blog
router.delete("/delete-post/:id", verifyToken, BlogController.deleteBlog);

//related posts
router.get("/related/:id", BlogController.getRelatedBlog);
export default router;