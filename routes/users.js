const express = require('express')
const router = express.Router()
const {getAllUsers,getUser,followUnfollowUser, getUserComments,getUserPosts,getUserFollowers,getUserFollowing} = require('../controllers/users')
const {auth,authorizePermissions} = require('../middlewares/authentication')

router.route('/').get([auth,authorizePermissions('admin')],getAllUsers)
router.route('/:username').get(auth,getUser)
router.route('/:otherUsername/follow').patch(auth,followUnfollowUser)
router.route('/:username/comments').get(auth,getUserComments)
router.route('/:username/posts').get(getUserPosts)
router.route('/:username/followers').get(getUserFollowers)
router.route('/:username/following').get(getUserFollowing)



module.exports = router