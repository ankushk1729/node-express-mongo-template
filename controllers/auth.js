const jwt = require("jsonwebtoken")
const {StatusCodes} = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const User = require('../models/User')


const register = async(req,res)=> {
    const user = await User.create({...req.body,role:'user'})
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({user:{name:user.username},token})
}
const login = async(req,res) => {
    const {email,password} = req.body
    if(!email || !password) throw new BadRequestError('Please provide email and password')
    const user = await User.findOne({email})
    if(!user) throw new UnauthenticatedError('Invalid email or password')
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect) throw new UnauthenticatedError('Invalid email or password')
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user:{name:user.username},token})
}


const verifyToken = async (req,res) => {
    const token = req.body.token
    try {
        const payload = jwt.verify(token,process.env.JWT_SECRET)    
        req.user = {username:payload.username,email:payload.email,role:payload.role}
        return res.status(200).json({verified:true})
    } catch (error) {
        return res.status(200).json({verified:false})
    }
}

module.exports = {login,register,verifyToken}
