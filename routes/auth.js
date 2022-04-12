const express = require('express')
const router = express.Router()
const {login,register,verifyToken} = require('../controllers/auth')


router.post('/login',login)
router.post('/register',register)
router.post('/verify-token',verifyToken)

module.exports = router