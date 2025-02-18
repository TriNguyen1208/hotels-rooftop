import mongoose from "mongoose";
import bcrypt from "bcrypt"

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user'
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})
//hash password
UserSchema.pre('save', async function (next){ //Hàm này sẽ hash password trước khi lưu
    const user = this; // this ở đây là document trước khi được lưu

    if (!user.isModified("password")) {
        return next(); // Nếu password không thay đổi, tiếp tục lưu
    }

    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword; // Gán password đã hash
        next(); // Tiếp tục
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Error when hashing password"
        })
    }
})

//compare password
UserSchema.methods.comparePassword = function (givenPassword) {
    return bcrypt.compare(givenPassword, this.password);
}
const User = mongoose.model("User", UserSchema);
export default User;