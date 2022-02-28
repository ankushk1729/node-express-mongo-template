const express = require('express')
const router = express.Router()
const {getAllUsers,getUser,followUnfollowUser, getUserComments,getUserPosts,getUserFollowers,getUserFollowing,updateProfile,deleteAllUsers,checkUsername,getTimelineUsers, getCurrentUser} = require('../controllers/users')
const {auth,authorizePermissions} = require('../middlewares/authentication')

router.route('/').get([auth,authorizePermissions('admin')],getAllUsers).delete([auth,authorizePermissions('admin')],deleteAllUsers)
router.route('/checkUsername').post(checkUsername)
router.route('/updateProfile').patch(auth,updateProfile)
router.route('/timelineUsers').get(auth,getTimelineUsers)
router.route('/currentUser').get(auth,getCurrentUser)
router.route('/:username').get(auth,getUser)
router.route('/:otherUsername/follow').patch(auth,followUnfollowUser)
router.route('/:username/comments').get(auth,getUserComments)
router.route('/:username/posts').get(auth,getUserPosts)
router.route('/:username/followers').get(auth,getUserFollowers)
router.route('/:username/following').get(auth,getUserFollowing)


module.exports = router