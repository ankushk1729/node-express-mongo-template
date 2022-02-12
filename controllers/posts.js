const { StatusCodes } = require('http-status-codes')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const User = require('../models/User')
const {NotFoundError} = require('../errors')
const checkPermissions = require('../utils/checkPermissions')

const getAllPosts = async (req,res) => {
  const {search} = req.query
  let posts
  if(search) posts = await Post.find({body:{$regex:search}})
  else posts = await Post.find({})
  if(!posts) throw new NotFoundError('No posts')
  res.status(StatusCodes.OK).json({posts})
}


const getPost = async(req,res) => {
    const {
        params: { id: postId },
      } = req;
    const post = await Post.findOne({_id:postId})
    res.status(StatusCodes.OK).json({post})
}
const createPost = async(req,res) => {
    req.body.createdBy = req.user.userId
    const post = await Post.create(req.body)
    res.status(StatusCodes.CREATED).json({post})
}
const likeDislikePost = async(req,res) => {
    const {
        user: { userId },
        params: { id: postId },
      } = req
    const post = await Post.findOne({_id:postId})
    if(!post.likes.includes(userId)){
        post.likes.push(userId)
    }
    else{
        post.likes = post.likes.filter(item=>item!=userId)
    }
    post.save()
    res.status(StatusCodes.OK).json({likes:post.likes.length})
}

const getPostComments = async (req,res) =>{
    const {id:postId} = req.params
    const comments = await Comment.find({post:postId})
    res.status(StatusCodes.OK).json({comments,count:comments.length})
}
const commentOnPost = async(req,res) => {
    const {
        user: { userId },
        params: { id: postId },
        body:{text}
      } = req
    const isPostValid = await Post.exists({_id:postId})
    if(!isPostValid) throw new NotFoundError(`No post with id ${postId}`)
    const comment = await Comment.create({user:userId,post:postId,text})
    res.status(StatusCodes.CREATED).json({msg:"Comment added"})
}
const deletePost = async (req,res) => {
     const {
        user: { userId },
        params: { id: postId },
      } = req
    const post = await Post.findOne({_id:postId})
    checkPermissions(req.user,post.createdBy)
    if(!post)
      throw new NotFoundError(`No post with id ${postId}`)
    await post.remove();
    res.status(StatusCodes.OK).json({msg:"Post deleted"})
}

const getTimelinePosts = async (req,res) => {
  const sort = req.query.sort
  let sortKey = ''
  if(sort === 'top') sortKey = '+likes'
  if(sort === 'recent') sortKey = '-createdAt'
  let posts = []
  if(sort === 'following'){
    const result = await User.findOne({_id:req.user.userId}).select('following')
    let following = result.following
    posts = await Post.find({createdBy:following}).sort('-createdAt')
  }
  else posts = await Post.find({}).sort(sortKey)


  
  // const allPosts = await Post.find({createdBy:{$nin:following}}).limit(10).sort('-createdAt')
  // const timelinePosts = [...followingPosts,...allPosts]
  // if(timelinePosts.length === 0) throw new NotFoundError('No posts')
  res.status(StatusCodes.OK).json({posts})
}

module.exports = {getPost,createPost,likeDislikePost,commentOnPost,deletePost,getPostComments,getAllPosts,getTimelinePosts}