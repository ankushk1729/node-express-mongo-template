const express = require('express')
const router = express.Router()
const {getPost,createPost,likeDislikePost,deletePost,commentOnPost,getPostComments,getAllPosts,getTimelinePosts} = require('../controllers/posts')
const upload = require('../controllers/upload')


router.route('/').get(getAllPosts).post(createPost)
router.route('/timeline').get(getTimelinePosts)
router.route('/:id').get(getPost).delete(deletePost)
router.route('/:id/like').patch(likeDislikePost)
router.route('/:id/comment').post(commentOnPost).get(getPostComments)
router.route('/uploads').post(upload)


module.exports = router