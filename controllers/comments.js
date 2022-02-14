const { StatusCodes } = require("http-status-codes")
const { NotFoundError } = require("../errors")
const Comment = require('../models/Comment')
const checkPermissions = require('../utils/checkPermissions')

const likeDislikeComment = async(req,res) => {
    const {
        user: { username },
        params: { id: commentId },
      } = req
    const comment = await Comment.findOne({_id:commentId})
    if(!comment) throw new NotFoundError(`No comment with id ${commentId}`)
    if(!comment.likes.includes(username)){
        comment.likes.push(username)
    }
    else{
        comment.likes = comment.likes.filter(item=>item!=username)
    }
    
    comment.save()
    res.status(StatusCodes.OK).json({likes:comment.likes.length})
}

const deleteComment = async (req,res) => {
    const {
        user: { username },
        params: { id: commentId },
      } = req
   
      const comment = await Comment.findOne({_id:commentId})
      if(!comment) throw new NotFoundError(`No comment with id ${commentId}`)
      checkPermissions(req.user,comment.user)

      await comment.remove()
      res.status(StatusCodes.OK).json({msg:"Comment deleted"})
}

const getComment = async (req,res) => {
    const {
        user: { username },
        params: { id: commentId },
      } = req
    
      const comment = await Comment.findOne({_id:commentId})
      if(!comment) throw new NotFoundError(`No comment with id ${commentId}`)

      res.status(StatusCodes.OK).json({comment})
}

const getAllComments = async (req,res) => {
    const comments = await Comment.find({})
    if(!comments) throw new NotFoundError('No comments')
    res.status(StatusCodes.OK).json({comments})
}

module.exports = {likeDislikeComment,deleteComment,getComment,getAllComments}