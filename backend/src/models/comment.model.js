import mongoose from "mongoose"

const CommentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }, //Comment này của user nào?
    // }, //Trường user trong Comment lưu trữ 1 objectID của trường User. Khi thấy danh sách người comment có thể dùng .populate() để lấy danh sách người comment
    //TODO: modify when create UserSchema
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Blog"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;