import { StatusCodes } from "http-status-codes";
import { createSingleContentData, deleteAllContentsData, deleteSingleContentData, getPaginatedContentsData, getSingleContentData, updateContentData } from "../services/content.service.js";

/* Get all contents without pagination

const getAllContents = async (req, res) => {
  const contents = await getAllContentsData(req)
  res.status(StatusCodes.OK).json({ contents, count: contents.length })
}
*/

const getContent = async (req, res) => {
  const content = await getSingleContentData(req)
  res.status(StatusCodes.OK).json({ content });
};

const getPaginatedContents = async (req, res) => {
  const contents = await getPaginatedContentsData(req)

  res.status(StatusCodes.OK).json({ contents, count: contents.length });
};

const createContent = async (req, res) => {
  const content = await createSingleContentData(req)
  res.status(StatusCodes.CREATED).json({ content });
};

const deleteContent = async (req, res) => {
  await deleteSingleContentData(req)
  res.status(StatusCodes.OK).json({ msg: "Content deleted" });
};

const deleteAllContents = async (req, res) => {
  await deleteAllContentsData(req)
  res.status(StatusCodes.OK).json({ msg: "Deleted all contents" });
};

const updateContent = async (req, res) => {
  const content = await updateContentData(req)

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
