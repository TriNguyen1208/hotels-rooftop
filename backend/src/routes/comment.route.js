import express from "express"
import * as CommentController from "../controllers/comment.controller.js"
import verifyToken from "../middleware/verifyToken.js";
const router = express.Router();

router.post("/post-comment", verifyToken, CommentController.createComment);

router.get("/total-comments", CommentController.getTotalComments);
export default router;