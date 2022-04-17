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

    const post = await Post.findOne({_id:postId}).populate({path:'user',model:'User',select:['profilePhoto']})
    if(!post) throw new NotFoundError(`No post with id ${postId}`)
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
    const { page } = req.query
    let pageNum = page
    const comments = await Comment.find({post:postId}).skip(pageNum*5).limit(5).sort('-createdAt').populate({path:'user_',model:'User',select:['profilePhoto']})
    const count = await Comment.countDocuments({post:postId})
    res.status(StatusCodes.OK).json({comments,count:comments.length,hasMore:count-(pageNum*5)})
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

const addUsersToPosts = async(posts) => {
  for(let post of posts){
    const user = await User.findOne({username:post.createdBy}).select('profilePhoto username')
    post.user = []
    post.user.push(user)
  }
  return posts
}


// Pending -> Repeating posts for top sort
const getTimelinePosts = async (req,res) => {
  const {username} = req.user
  const {sort,page} = req.query
  let pageNum = page ? page : 0
  const user = await User.findOne({username}).select('+username +profilePhoto')
  let posts = []
  let postCount = 0
  let postCountTemp
  if(sort === 'top') {
    postsData = await Post.aggregate( [
      {$match:{createdBy:{$nin:[username]}}},
    { "$project": {
        "body":1,
        "image":1,
        "createdBy":1,
        "likes":1,
        "numOfComments":1,
        "length": { "$size": "$likes" }
    }},
    { "$sort": { "length": -1,"_id":1 } },
    {
      "$skip":+pageNum*2
    },{
      "$limit":2
    }
])
  
  postCountTemp = await Post.aggregate( [
        {$match:{createdBy:{$nin:[username]}}},{
          $count:'count'
        }
  ])
    postCount = postCountTemp[0].count
    posts = await addUsersToPosts(postsData)
  }
  else if(sort === 'recent') {
      postCount = await Post.find({"createdBy":{$ne:username}}).count()
     posts = await Post.find({"createdBy":{$ne:username}}).sort("-createdAt").populate({path:'user',model:'User',select:['profilePhoto']}).skip(+pageNum*2).limit(2)
  }
  else if(sort === 'following'){
    const result = await User.findOne({username}).select('following')
    let following = result.following
    postCount = await Post.find({createdBy:following}).count()
    posts = await Post.find({createdBy:following}).sort('-createdAt').populate({path:'user',model:'User',select:['profilePhoto']}).skip(+pageNum*2).limit(2)
  }
  else {
     postCount = await Post.find({"createdBy":{$ne:username}})
    posts = await Post.find({"createdBy":{$ne:username}}).populate({path:'user',model:'User',select:['profilePhoto']}).skip(+pageNum*2).limit(2)
  }
  console.log(posts)
  const count_ = await Post.count()
  res.status(StatusCodes.OK).json({posts,count:posts.length,hasMore:(postCount - (+page*2+2))>0})
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

  const {page} = req.query

  const user = await User.findOne({username})

  if(!user) throw new NotFoundError(`No user with username ${username}`)
  
  const savedPosts = user.savedPosts
  let posts = await getSaved(savedPosts)
  let tempPosts = posts
  let hasMore = false
  posts.splice(0,(+page)*2)
  if(posts.length >= 2){
    hasMore = true
    posts.length = 2
  }
  console.log(posts)
  res.status(StatusCodes.OK).json({posts,count:posts.length,hasMore})
}

module.exports = {getPost,createPost,likeDislikePost,commentOnPost,deletePost,getPostComments,getAllPosts,getTimelinePosts,deleteAllPosts,saveUnsavePost,getSavedPosts,addUsersToPosts}