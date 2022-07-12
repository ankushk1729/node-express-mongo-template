const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const User = require('../models/User')
const Content = require('../models/Content')
const mongoose = require('mongoose');


const getUser = async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id).select('-password')

    if (!user) throw new NotFoundError(`No user with id ${id}`)

    res.status(StatusCodes.OK).json({ user })
}

const getAllUsers = async (req, res) => {
    const users = await User.find({}).select('-password')
    res.status(StatusCodes.OK).json({ users, count: users.length })
}



const getUserContents = async (req, res) => {

    const { id: stringId } = req.params

    const id = mongoose.Types.ObjectId(stringId)

    const isUser = await User.exists({ _id: id })
    if (!isUser) throw new NotFoundError(`No user with id ${id}`)

    const contents = await Content.find({ createdBy: id })

    res.status(StatusCodes.OK).json({ user: id, contents })
}

const deleteUser = async (req, res) => {
    const { id } = req.params

    const isUser = await User.exists({ _id: id })

    if(!isUser) throw new NotFoundError(`No user with id, ${id}`)

    const user = await User.findById(id)

    if(user.role === 'admin') throw new BadRequestError(`Can't remove the user with id, ${id}`)

    await User.deleteOne({ _id: id })

    res.status(StatusCodes.OK).json({ msg: "User deleted" })
}

const checkUsername = async (req, res) => {
    const { username } = req.query
    const user = await User.findOne({ username })
    if (!user) {
        res.status(StatusCodes.OK).json({ available: true })
        return
    }
    res.status(StatusCodes.OK).json({ available: false })
}

const getCurrentUser = async (req, res) => {
    const { user: { username } } = req
    const user = await User.findOne({ username }).select('-password')

    if (!user) throw new NotFoundError(`No user with username ${username}`)

    res.status(StatusCodes.OK).json({ user })
}

const updateUser = async (req, res) => {

    const { bio } = req.body // add other properties here

    const user = await User.findByIdAndUpdate(req.user.id, { bio }, { new: true}).select('-password')

    res.status(StatusCodes.OK).json({ user })
}

module.exports = { getUser, getAllUsers, getUserContents, deleteUser, checkUsername, getCurrentUser, updateUser }