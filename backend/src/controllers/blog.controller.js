import Blog from "../models/blog.model.js";
import Comment from "../models/comment.model.js";

export async function getAllBlogs(req, res){
    try{
        const {search, category, location} = req.query; //Cu phap la api/blogs?search=abc
        console.log(search);
        let query = {};
        if(search){
            query = {
                ...query,
                $or: [ //Kiểm tra nhiều điều kiện nếu như 1 điều kiện đúng thì thỏa
                    {
                        title: {
                            $regex: search, //Tìm kiếm chuỗi search trong trường title
                            $options: "i" //Không phân biệt chữ hoa hay chữ thường
                        },
                    },
                    {
                        content: {
                            $regex: search,
                            $options: "i"
                        }
                    }
                ],
            }
        }
        if(category){
            query = {
                ...query,
                category: category
            }
        }
        if(location){
            query = {
                ...query,
                location: location
            }
        }
        console.log(query);
        const post = await Blog.find(query).populate("author", "email").sort({createAt: -1}); //-1 là giảm dần, 1 là tăng dần. Nếu theo bảng chữ cái thì là title: -1
        res.status(200).send({
            message: "Get all blog successfully",
            posts: post
        })
        //Get all post
        // const post = await Blog.find();
        // res.status(200).send({
        //     message: "Get all blog successful",
        //     posts: post
        // })
    }catch(error){
        console.error(error);
        res.status(500).send({
            message: "Having error in there"
        })
    }
}
export async function createBlog(req, res){
    try{
        const newPost = new Blog({...req.body, author: req.userId}); //TODO:để dùng req.userId thì phải có verify token 
        await newPost.save();
        res.status(201).send({
            message: "Post created successfully",
            post: newPost
        });
    }catch(error){
        console.error(error);
        res.status(500).send({
            message: "Having error in there"
        })
    }
}

//Get single blog by id
export async function getBLog(req, res){
    try{
        const postId = req.params.id; //Tra ve id 
        const post = await Blog.findById(postId); //Tra ve post kieu json(Object)
        if(!post){
            return res.status(404).send({
                message: "Post not found"
            })
        }
        const comment = await Comment.find({postId: postId}).populate("user", "username email"); //Lấy tất cả các comment có id là postId, ở trường user(tham số thứ 1) tham chiếu với UserSchema chỉ lấy trường username và email
        res.status(200).send({
            message: "Get one post successfully",
            post: post
        })
    }catch(error){
        console.error(error);
        res.status(500).send({
            message: "Having error in there"
        })
    }
}
export async function updateBlog(req, res){
    try {
        const postId = req.params.id;
        const updatedPost = await Blog.findByIdAndUpdate(postId, {
            ...req.body
        }, {new: true}); //Nếu không dùng new: true thì dữ liệu trong database vẫn thay đổi tuy nhiên updatedPost vẫn là dữ liệu cũ
        if(!updatedPost){
            return res.status(404).send({
                message: "Post not found"
            })
        }
        // await updatedPost.save(); //Không cần dùng cái này vì findByIdAndUpdate đã thay đổi dữ liệu trong database
        res.status(200).send({
            message: "Post is updated",
            post: updatedPost
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Having error in there"
        })
    }
}
export async function deleteBlog(req, res){
    try {
        const postId = req.params.id;
        const deletedPost = await Blog.findByIdAndDelete(postId);
        if(!deletedPost){
            return res.status(404).send({
                message: "Post not found"
            })
        }
        await Comment.deleteMany({postId: postId}) //Khi mà xóa 1 blog thì sẽ xóa tất cả các comment có chứa ID của blog đó
        res.status(200).send({
            message: "Post is deleted",
            post: deletedPost
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Having error in there"
        })
    }
}
export async function getRelatedBlog(req, res){
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).send({
                message: "Post id is require"
            })
        }
        const blog = await Blog.findById(id);
        if(!blog){
            return res.status(404).send({
                message: "Post isn't found"
            })
        }
        const titleRegex = new RegExp(blog.title.split(" ").join("|"), "i"); //tạo regex dạng: /How|to|learn|Node.js/i. Dấu | có nghĩa là or. Split có nghĩa là tạo mảng
        console.log(titleRegex);
        const relatedQuery = {
            _id: {$ne: id}, //Thằng nào có _id giống id là bỏ ra
            title: {$regex: titleRegex} //Check xem title có kí tự nào liên quan không
        }
        console.log(relatedQuery);
        const relatedPost = await Blog.find(relatedQuery).sort({createAt: -1});
        res.status(200).send({
            message: "Related post found",
            posts: relatedPost
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Having error in there"
        })
    }
}