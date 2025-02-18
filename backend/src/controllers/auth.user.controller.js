import express from "express"
import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import generateToken from "../middleware/generateToken.js";
export async function registerUser(req, res){
    try {
        const {email, password, username} = req.body;
        const user = new User({email, password, username})
        await user.save();
        res.status(200).send({
            message: "User registered successfully",
            user: user
        })
    } catch (error) {
        console.error("Failed to register");
        res.status(500).send({
            message: "Registration fail"
        })
    }
}
export async function loginUser(req, res){
    try {
        const {email, password} = req.body; //Thiếu trường username (có required: true) chỉ bị lỗi khi save(), create()

        const user = await User.findOne({email: email}); //Only need email and password to login
        if(!user){
            return res.status(404).send({
                message: "User not found"
            })
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(401).send({
                message: "Invalid password"
            })
        }
        //generate token
        const token = await generateToken(user._id);
        res.cookie("token", token, {
            httpOnly: true, //Nếu httpOnly = false, hacker có thể dùng document.cookie để lấy token. Khi httpOnly = true, JavaScript trên trình duyệt không thể đọc cookie này, chỉ có server mới đọc được.
            secure: true, //Chỉ gửi cookie qua HTTPS, giúp bảo mật hơn
            sameSite: true //Chặn tấn công CSRF, chỉ cho phép cookie gửi trong cùng một trang web
        })
        console.log(token);
        res.status(200).send({
            messsage: "Login successful!",
            token: token, //gửi token cho frontend để lưu vào localStorage
            user: user
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Login failed! Try again",
        })
    }
}

export async function logoutUser(req, res){
    try {
        res.clearCookie("token");
        res.status(200).send({
            message: "Logout successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Logout failed! Try again",
        })
    }
}

//get all users
export async function getAllUser(req, res){
    try {
        const users = await User.find({}, "id email role");
        res.status(200).send({
            message: "Get all successfully",
            users: users
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Get all users failed",
        })
    }
}
export async function deleteUser(req, res){
    try {
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id);
        if(!user){
            return res.status(404).send({
                message: "User not found"
            })
        }
        res.status(200).send({
            message: "Delete one user successfully",
            user: user
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Deleted user failed",
        })
    }
}

//update a user role
export async function updateRole(req, res) {
    try {
        const {id} = req.params;
        const {role} = req.body;
        const user = await User.findByIdAndUpdate(id, {role: role}, {new: true});
        if(!user){
            return res.status(404).send({
                message: "User not found"
            })
        }
        console.log(user);
        res.status(200).send({
            message: "Update role successfully",
            user: user
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Updated user role failed",
        })
    }
}