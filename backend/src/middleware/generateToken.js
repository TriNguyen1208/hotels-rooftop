import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY; //Key để ký token
// Mục đích của JWT (JSON Web Token) là để xác thực và cấp quyền truy cập cho người dùng
async function generateToken(userId){
    try {
        const user = await User.findById(userId);
        if(!user){
            throw new Error("User not found");
        }
        //Token gồm 3 phần là header, payload và signature
        //Phần header thì được jwt tự tạo khi dùng jwt.sign.
        //Phần payload là lưu vào token có dạng {userId: user._id, role: user.role}
        //Phần signature được header và payload kết hợp với JWT_SECRET tạo nên
        const token = jwt.sign({userId: user._id, role: user.role}, JWT_SECRET, {expiresIn: "1h"});
        return token;
    } catch (error) {
        console.error(error);
    }
}
export default generateToken;