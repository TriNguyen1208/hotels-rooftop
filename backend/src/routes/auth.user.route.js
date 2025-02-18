import express from "express"
import * as UserController from "../controllers/auth.user.controller.js"
const router = express.Router();

//register a new user
router.post("/register", UserController.registerUser);

router.post("/login", UserController.loginUser);

router.post("/logout", UserController.logoutUser);

router.get("/users", UserController.getAllUser);

router.delete("/users/:id", UserController.deleteUser);

router.patch("/users/:id", UserController.updateRole);

export default router;