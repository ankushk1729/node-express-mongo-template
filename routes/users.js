const express = require('express')
const router = express.Router()
const {getAllUsers,getUser,followUnfollowUser, getUserComments,getUserPosts} = require('../controllers/users')
const {auth,authorizePermissions} = require('../middlewares/authentication')

router.route('/').get([auth,authorizePermissions('admin')],getAllUsers)
router.route('/:username').get(auth,getUser)
router.route('/:otherUsername/follow').patch(auth,followUnfollowUser)
router.route('/:username/comments').get(auth,getUserComments)
router.route('/:username/posts').get(getUserPosts)


module.exports = router