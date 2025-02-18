import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv";
import cors from "cors";
import blogRoute from "./src/routes/blog.route.js"
import commentRoute from "./src/routes/comment.route.js"
import userRoute from "./src/routes/auth.user.route.js"

dotenv.config(); //cai nay phai de len dau

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); //dung de phan tich cu phap du lieu json tu req.body(khong co thi khong dung duoc)
app.use(cors()); //dung de frontend co the ket noi voi backend
app.use("/api/blogs", blogRoute);
app.use("/api/comments", commentRoute);
app.use("/api/auth", userRoute);


app.listen(port);

async function connectMongoDb(){
    await mongoose.connect(process.env.MONGODB_URL);
}

connectMongoDb()
    .then(()=> console.log("Connected mongoDB successfully"))
    .catch(err => console.error(err)); //Connect toi mongoDB
    