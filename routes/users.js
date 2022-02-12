const express = require('express')
const router = express.Router()
const {getAllUsers,getUser,followUnfollowUser, getUserComments,getUserPosts} = require('../controllers/users')
const {auth,authorizePermissions} = require('../middlewares/authentication')

router.route('/').get([auth,authorizePermissions('admin')],getAllUsers)
router.route('/:id').get(auth,getUser)
router.route('/:id/follow').patch(auth,followUnfollowUser)
router.route('/:id/comments').get(auth,getUserComments)
router.route('/:id/posts').get(getUserPosts)


module.exports = router