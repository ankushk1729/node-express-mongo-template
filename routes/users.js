const express = require('express')
const router = express.Router()
const {getAllUsers,getUser,followUnfollowUser, getUserComments,getUserPosts,getUserFollowers,getUserFollowing,updateProfile,deleteAllUsers} = require('../controllers/users')
const {auth,authorizePermissions} = require('../middlewares/authentication')

router.route('/').get([auth,authorizePermissions('admin')],getAllUsers).delete([auth,authorizePermissions('admin')],deleteAllUsers)
router.route('/:username').get(auth,getUser)
router.route('/updateProfile').patch(auth,updateProfile)
router.route('/:otherUsername/follow').patch(auth,followUnfollowUser)
router.route('/:username/comments').get(auth,getUserComments)
router.route('/:username/posts').get(auth,getUserPosts)
router.route('/:username/followers').get(auth,getUserFollowers)
router.route('/:username/following').get(auth,getUserFollowing)



module.exports = router