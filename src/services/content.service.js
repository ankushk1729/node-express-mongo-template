import User from '../models/user.model.js'
import Content from "../models/content.model.js";

import mongoose from 'mongoose'
import NotFoundError from '../errors/notFound.js';
import BadRequestError from '../errors/badRequest.js';
import checkPermissions from '../utils/checkPermissions.js';


const getSingleContentData = async (req) => {
    const {
        params: { id: contentId },
    } = req;

    const content = await Content.findOne({ _id: contentId });
    if (!content) throw new NotFoundError(`No content with id ${contentId}`);

    return content
}

const getPaginatedContentsData = async (req) => {
    const { limit, offset } = req.query;

    const contents = await Content.find({})
        .skip(+offset)
        .limit(+limit);

    return contents
}

/* Get all contents without pagination

const getAllContentsData = async (req) => {

  contents = await Content.find({})
  if (!contents) throw new NotFoundError('No contents')
  return contents
}
*/

const createSingleContentData = async (req) => {
    req.body.createdBy = mongoose.Types.ObjectId(req.user.id);

    const content = await Content.create(req.body);

    return content
}

const deleteSingleContentData = async (req) => {
    const {
        user: { username },
        params: { id: contentId },
      } = req;
      const content = await Content.findOne({ _id: contentId });
      if (!content) throw new NotFoundError(`No content with id ${contentId}`);
    
      checkPermissions(req.user, content.createdBy);
      await content.remove();
}

const deleteAllContentsData = async (req) => {
    await Content.deleteMany({});
}

const updateContentData = async (req) => {
    const { id } = req.params;

    const { text } = req.body; // ...other properties
  
    const isContent = await Content.exists({ _id: id });
  
    if (!isContent) throw new NotFoundError(`No content with id ${id}`);
  
    const content = await Content.findByIdAndUpdate(id, { text }, { new: true });

    return content
}

export { getSingleContentData, getPaginatedContentsData, createSingleContentData, deleteSingleContentData, deleteAllContentsData, updateContentData }