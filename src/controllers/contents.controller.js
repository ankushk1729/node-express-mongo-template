import { StatusCodes } from "http-status-codes";
import Content from "../models/Content.js";
import User from "../models/User.js";
import { NotFoundError, BadRequestError } from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";
import mongoose from "mongoose";

/* Get all contents without pagination

const getAllContents = async (req, res) => {

  contents = await Content.find({})
  if (!contents) throw new NotFoundError('No contents')
  res.status(StatusCodes.OK).json({ contents, count: contents.length })
}
*/

const getContent = async (req, res) => {
  const {
    params: { id: contentId },
  } = req;

  const content = await Content.findOne({ _id: contentId });
  if (!content) throw new NotFoundError(`No content with id ${contentId}`);
  res.status(StatusCodes.OK).json({ content });
};

const getPaginatedContents = async (req, res) => {
  const { limit, offset } = req.query;

  const contents = await Content.find({})
    .skip(+offset)
    .limit(+limit);

  res.status(StatusCodes.OK).json({ contents, count: contents.length });
};

const createContent = async (req, res) => {
  req.body.createdBy = mongoose.Types.ObjectId(req.user.id);

  const content = await Content.create(req.body);
  res.status(StatusCodes.CREATED).json({ content });
};

const deleteContent = async (req, res) => {
  const {
    user: { username },
    params: { id: contentId },
  } = req;
  const content = await Content.findOne({ _id: contentId });

  checkPermissions(req.user, content.createdBy);
  if (!content) throw new NotFoundError(`No content with id ${contentId}`);
  await content.remove();
  res.status(StatusCodes.OK).json({ msg: "Content deleted" });
};

const deleteAllContents = async (req, res) => {
  await Content.deleteMany({});
  res.status(StatusCodes.OK).json({ msg: "Deleted all contents" });
};

const updateContent = async (req, res) => {
  const { id } = req.params;

  const { text } = req.body; // ...other properties

  const isContent = await Content.exists({ _id: id });

  if (!isContent) throw new NotFoundError(`No content with id ${id}`);

  const content = await Content.findByIdAndUpdate(id, { text }, { new: true });

  res.status(StatusCodes.OK).json({ content });
};

export {
  getContent,
  getPaginatedContents,
  deleteContent,
  deleteAllContents,
  createContent,
  updateContent,
};
