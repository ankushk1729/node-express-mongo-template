const { StatusCodes } = require('http-status-codes')
const { BadRequestError } = require('../errors')
const User = require('../models/User')
const Comment = require('../models/Comment')
const Post = require('../models/Post')

const getUser = async (req,res) => {
    const {id:userId} = req.params
    const user = await User.findOne({_id:userId})
    res.status(StatusCodes.OK).json({user})
}
const getAllUsers = async (req,res) => {
    const users = await User.find({})
    res.status(StatusCodes.OK).json({users})
}

const followUnfollowUser = async (req,res) => {
    const {
        user: { userId },
        params: { id: otherUserId },
      } = req
    if(userId === otherUserId)
        throw new BadRequestError('Invalid request')
    let msg = ""
    const currentUser = await User.findOne({_id:userId})
    if(!currentUser.following.includes(otherUserId)){
        currentUser.following.push(otherUserId)
        msg = "Followed"
    }
    else{
        currentUser.following = currentUser.following.filter(item=>item!=otherUserId)
        msg = "Unfollowed"
    }
    currentUser.save()

    const otherUser = await User.findOne({_id:otherUserId})
    if(!otherUser.followers.includes(userId))
        otherUser.followers.push(userId)
    else
        otherUser.followers = otherUser.followers.filter(item=>item!=userId)
    otherUser.save()
    res.status(StatusCodes.OK).json({msg})
}

const getUserComments = async (req,res) =>{
    const {id:userId} = req.params
    const comments = await Comment.find({user:userId})
    res.status(StatusCodes.OK).json({comments,count:comments.length})
}

const getUserPosts = async(req,res) => {
    const {id:userId} = req.params
    const posts = await Post.find({createdBy:userId})
    res.status(StatusCodes.OK).json({posts})
}

module.exports = {getUser,getAllUsers,followUnfollowUser,getUserComments,getUserPosts}