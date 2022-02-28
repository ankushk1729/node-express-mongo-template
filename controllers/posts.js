const { StatusCodes } = require('http-status-codes')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const User = require('../models/User')
const {NotFoundError, BadRequestError} = require('../errors')
const checkPermissions = require('../utils/checkPermissions')
const mongoose = require('mongoose')

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
    req.body.createdBy = req.user.username

    const post = await Post.create(req.body)
    res.status(StatusCodes.CREATED).json({post})
}
const likeDislikePost = async(req,res) => {
    const {
      user: { username },
      params: { id: postId },
    } = req
    const post = await Post.findOne({_id:postId})
    if(!post) throw new NotFoundError(`No post with ${postId} to like/unlike`)
    if(!post.likes.includes(username)){
      post.likes.push(username)
    }
    else{
      post.likes = post.likes.filter(item=>item!=username)
    }
    
    post.save()
    res.status(StatusCodes.OK).json({likes:post.likes.length})
}

const getPostComments = async (req,res) =>{
    const {id:postId} = req.params
    const comments = await Comment.find({post:postId}).sort('-createdAt').populate({path:'user_',model:'User',select:['profilePhoto']})
    res.status(StatusCodes.OK).json({comments,count:comments.length})
}
const commentOnPost = async(req,res) => {
    const {
      user: { username },
      params: { id: postId },
      body:{text}
    } = req
    const isPostValid = await Post.exists({_id:postId})
    if(!isPostValid) throw new NotFoundError(`No post with id ${postId}`)
    const comment = await Comment.create({user:username,post:postId,text})
    const user = await User.findOne({username}).select('profilePhoto')
    comment.user_ = user
    res.status(StatusCodes.CREATED).json({msg:"Comment added",comment})
}
const deletePost = async (req,res) => {
    const {
      user: { username },
      params: { id: postId },
    } = req
    const post = await Post.findOne({_id:postId})

    checkPermissions(req.user,post.createdBy)
    if(!post)
      throw new NotFoundError(`No post with id ${postId}`)
    await post.remove();
    res.status(StatusCodes.OK).json({msg:"Post deleted"})
}

const deleteAllPosts = async(req,res) => {

    await Post.deleteMany({})
    res.status(StatusCodes.OK).json({msg:"Deleted all posts"})

}
// Pending
const getTimelinePosts = async (req,res) => {
  const {username} = req.user
  const sort = req.query.sort
  const user = await User.findOne({username}).select('+username +profilePhoto')
  let posts = []

  if(sort === 'top') posts = await Post.aggregate([{$addFields:{count:{$size:"$likes"}}},{$sort:{count:-1}}])
  else if(sort === 'recent') posts = await Post.find({}).sort("-createdAt")
  else if(sort === 'following'){
    const result = await User.findOne({username}).select('following')
    let following = result.following
    posts = await Post.find({createdBy:following}).sort('-createdAt')
  }
  // else posts = await Post.aggregate([{$sortByCount:"$likes"}])


  // These are old comments (not of changing id to username)
  // const allPosts = await Post.find({createdBy:{$nin:following}}).limit(10).sort('-createdAt')
  // const timelinePosts = [...followingPosts,...allPosts]
  // if(timelinePosts.length === 0) throw new NotFoundError('No posts')
  else {
    posts = await Post.find({}).populate({path:'user',model:'User',select:['profilePhoto']})
    posts = posts.filter(post=>post.createdBy !== username)
  }
  res.status(StatusCodes.OK).json({posts})
}

const saveUnsavePost = async(req,res) => {
  const {
    user: { username },
    params: { id: postId },
  } = req

  const isPost = await Post.exists({id:postId})
  const user = await User.findOne({username})

  if(!user) throw new NotFoundError(`No user with username ${username}`)
  if(!isPost) throw new NotFoundError(`No post with id ${postId}`)

  let msg = ""

  if(!user.savedPosts.includes(postId)){
    user.savedPosts.push(postId)
    msg = "Saved post"
  }
  else {
    user.savedPosts = user.savedPosts.filter(item=>item!=postId)
    msg = "Removed saved post"
  }
  await user.save()

  res.status(StatusCodes.OK).json({msg})


}

const getSaved = async(posts) => {
  ans = []
  for(let p of posts){
      let post = await Post.findById(p).populate({path:'user',model:'User',select:['profilePhoto']})
      ans.push(post)
  }
  return ans
}

const getSavedPosts = async(req,res) => {
  const {username} = req.user

  const user = await User.findOne({username})

  if(!user) throw new NotFoundError(`No user with username ${username}`)
  
  const savedPosts = user.savedPosts
  const posts = await getSaved(savedPosts)
  
  res.status(StatusCodes.OK).json({posts,count:savedPosts.length})


}

module.exports = {getPost,createPost,likeDislikePost,commentOnPost,deletePost,getPostComments,getAllPosts,getTimelinePosts,deleteAllPosts,saveUnsavePost,getSavedPosts}