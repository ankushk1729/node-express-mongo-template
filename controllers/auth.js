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
    const isPasswordCorrect = user.comparePassword(password)
    if(!isPasswordCorrect) throw new UnauthenticatedError('Invalid email or password')
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user:{name:user.username},token})
}


module.exports = {login,register}