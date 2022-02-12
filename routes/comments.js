const express = require('express')
const { likeDislikeComment,deleteComment,getComment,getAllComments } = require('../controllers/comments')
const {authorizePermissions} = require('../middlewares/authentication')
const router = express.Router()

router.route('/').get(authorizePermissions('admin'),getAllComments)
router.route('/:id/like').patch(likeDislikeComment)
router.route('/:id').delete(deleteComment).get(getComment)

module.exports = router