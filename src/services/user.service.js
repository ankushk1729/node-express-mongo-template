import User from '../models/user.model.js'
import Content from "../models/content.model.js";

import mongoose from 'mongoose'
import NotFoundError from '../errors/notFound.js';
import BadRequestError from '../errors/badRequest.js';

const getSingleUser = async (req) => {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) throw new NotFoundError(`No user with id ${id}`);

    return user
}

const getAllUsersData = async (req) => {
    const users = await User.find({}).select("-password");
    return users
}

const getSingleUserContents = async (req) => {
    const { id: stringId } = req.params;

    const id = mongoose.Types.ObjectId(stringId);

    const isUser = await User.exists({ _id: id });
    if (!isUser) throw new NotFoundError(`No user with id ${id}`);

    const contents = await Content.find({ createdBy: id });

    return contents
}

const deleteSingleUser = async (req) => {
    const { id } = req.params;

    const isUser = await User.exists({ _id: id });

    if (!isUser) throw new NotFoundError(`No user with id, ${id}`);

    const user = await User.findById(id);

    if (user.role === "admin")
        throw new BadRequestError(`Can't remove the user with id, ${id}`);

    await User.deleteOne({ _id: id });
}

const checkUsernameDuplicate = async (req) => {
    const { username } = req.query;
    const isUserExists = await User.exists({ username });
    return isUserExists
}

const getCurrentUserInfo = async (req) => {
    const {
        user: { username },
    } = req;
    const user = await User.findOne({ username }).select("-password");

    if (!user) throw new NotFoundError(`No user with username ${username}`);

    return user

}

const updateCurrentUser = async (req) => {
    const { bio } = req.body; // add other properties here

    const user = await User.findByIdAndUpdate(
        req.user.id,
        { bio },
        { new: true }
    ).select("-password");

    return user
}

export { getSingleUser, getAllUsersData, getSingleUserContents, deleteSingleUser, checkUsernameDuplicate, getCurrentUserInfo, updateCurrentUser }