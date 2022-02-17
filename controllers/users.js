const { StatusCodes } = require('http-status-codes')
const { BadRequestError,NotFoundError } = require('../errors')
const User = require('../models/User')
const Comment = require('../models/Comment')
const Post = require('../models/Post')

const getUser = async (req,res) => {
    const {username} = req.params
    const user = await User.findOne({username}).select('-password')

    if(!user) throw new NotFoundError(`No user with username ${username}`)

    res.status(StatusCodes.OK).json({user})

}

const updateProfile = async(req,res) => {
    const {
        user: { username }
    } = req
    const user = await User.findOne({username})

    if(!user) throw new NotFoundError(`No user with username ${username}`)

    const { profilePhoto,bio } = req.body
    
    if(profilePhoto){
        console.log("here")
        user.profilePhoto = profilePhoto
    }
    if(bio){
        user.bio = bio
    }
    await user.save()

    const {_doc} = user
    const {password,...data} = _doc
    
    res.status(StatusCodes.OK).json({user:data})

}

const getTimelineUsers = async(req,res) => {
    const { count,sort } = req.query
    let users = []
    console.log(count,sort)
    if(!count && !sort){
         users = await User.find({}).select('-password')
    }
    else if(count && sort){
        users = await User.aggregate([{$addFields:{count:{$size:"$followers"}}},{$sort:{count:-1}}]).limit(+count)

    }
    else if(count && !sort){
        users = await User.find({}).limit(+count)
    }
    else {
        users = await User.aggregate([{$addFields:{count:{$size:"$followers"}}},{$sort:{count:-1}}]).select('-password')
    }

    res.status(StatusCodes.OK).json({users})
}

const getAllUsers = async (req,res) => {
    const users = await User.find({}).select('-password')
    res.status(StatusCodes.OK).json({users})
}

const followUnfollowUser = async (req,res) => {
    const {
        user: { username },
        params: { otherUsername },
      } = req
    if(username === otherUsername)
      throw new BadRequestError('Invalid request')

    let msg = ""
    const currentUser = await User.findOne({username})
    const otherUser = await User.findOne({username:otherUsername})
    
    if(!currentUser || !otherUser)
      throw new BadRequestError("Invalid request")
    
    if(!currentUser.following.includes(otherUsername)){
        currentUser.following.push(otherUsername)
        msg = "Followed"
    }
    else{
        currentUser.following = currentUser.following.filter(item=>item!=otherUsername)
        msg = "Unfollowed"
    }
    currentUser.save()
    
    if(!otherUser.followers.includes(username))
        otherUser.followers.push(username)
    else
        otherUser.followers = otherUser.followers.filter(item=>item!=username)
    otherUser.save()

    res.status(StatusCodes.OK).json({msg})
}



const getUserComments = async (req,res) =>{

    const {username} = req.params

    const isUser = await User.exists({username})
    if(!isUser) throw new NotFoundError(`No user with username ${username}`)

    const comments = await Comment.find({user:username})

    res.status(StatusCodes.OK).json({comments,count:comments.length})
}

const getUserPosts = async(req,res) => {

    const {username} = req.params

    const isUser = await User.exists({username})
    if(!isUser) throw new NotFoundError(`No user with username ${username}`)

    const posts  = await Post.find({createdBy:username})

    res.status(StatusCodes.OK).json({posts})
}
const getFollowUsers = async(users) => {
    ans = []
    for(let u of users){
        let user = await User.findOne({username:u}).select('username profilePhoto -_id')
        ans.push(user)
    }
    return ans
}

const getUserFollowers = async(req,res) => {

    const {username} = req.params

    const isUser = await User.exists({username})
    if(!isUser) throw new NotFoundError(`No user with username ${username}`)

    const followersTemp = await User.findOne({username}).select('followers -_id')
    followersName = followersTemp.followers
    const followers = await getFollowUsers(followersName)
    res.status(StatusCodes.OK).json({followers,count:followers.length})
}


const getUserFollowing = async(req,res) => {

    const {username} = req.params

    const isUser = await User.exists({username})
    if(!isUser) throw new NotFoundError(`No user with username ${username}`)

    const followingTemp = await User.findOne({username}).select('following -_id')
    followingName = followingTemp.following
    const following = await getFollowUsers(followingName)

    res.status(StatusCodes.OK).json({following,count:following.length})
}

const deleteAllUsers = async(req,res) => {
    await User.deleteMany({})
    res.status(StatusCodes.OK).json({msg:"Deleted all users"})
}


module.exports = {getUser,getAllUsers,followUnfollowUser,getUserComments,getUserPosts,getUserFollowers,getUserFollowing,updateProfile,deleteAllUsers}