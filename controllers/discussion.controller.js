import User from "../models/auth.model.js";
import Comment from "../models/discussion.model.js";

export const createComment = async (req,res,next)=>{
    try {
        const { userId, comment, parentCommentId } = req.body;

        const user = await User.findById(userId)
        const isParentComment = await Comment.findById(parentCommentId)

        if(!user){
            return res.status(401).json({error:'Unauthorized User'})
        }
        if(!comment){
            return res.status(401).json({error:'Message is Request'})
        }
        if(!isParentComment && parentCommentId){
            return res.status(401).json({error:'Something Error'})
        }

        const newDiscussion = new Comment({userId,comment,parentCommentId})
        const discussion = await newDiscussion.save()
        return res.json(discussion)
        
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error:'Something wrong'
        })
    }
}