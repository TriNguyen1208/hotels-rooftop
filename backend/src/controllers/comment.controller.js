import express from "express"
import Comment from "../models/comment.model.js"
// export async function 

export async function createComment(req, res){
    try{
        const comment = new Comment({...req.body, user: req.userId});
        await comment.save();
        res.status(201).send({
            message: "Create comment successfully",
            comment: comment
        })
    }catch(error){
        console.log(error);
        res.status(500).send({
            message: "Having error in comment schema"
        })
    }
}

export async function getTotalComments(req, res){
    try {
        const totalComment = await Comment.countDocuments({});
        res.status(200).send({
            message: "Total comments count",
            countComment: totalComment
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Having error in comment schema"
        })
    }
}