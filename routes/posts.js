const express = require('express')
const router = express.Router()
const {getPost,createPost,likeDislikePost,deletePost,commentOnPost,getPostComments,getAllPosts,getTimelinePosts,deleteAllPosts,saveUnsavePost,getSavedPosts} = require('../controllers/posts')
const upload = require('../controllers/upload')
const {authorizePermissions} = require('../middlewares/authentication')



router.route('/').get(authorizePermissions('admin'),getAllPosts).post(createPost).delete(authorizePermissions('admin'),deleteAllPosts)
router.route('/timeline').get(getTimelinePosts)
router.route('/savedPosts').get(getSavedPosts)
router.route('/:id').get(getPost).delete(deletePost)
router.route('/:id/like').patch(likeDislikePost)
router.route('/:id/comment').post(commentOnPost).get(getPostComments)
router.route('/:id/save').post(saveUnsavePost)
router.route('/uploads').post(upload)


module.exports = router