const {BadRequestError} = require('../errors')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
const { StatusCodes } = require('http-status-codes')


const upload = async(req,res) => {
    const { dest } = req.query
    if(!dest) throw new BadRequestError('No destination provided for image upload')
    const maxSize = 1024*1024
    if(!req.files) throw new BadRequestError('File not found')
    const postImage = req.files.image

    if(!postImage.mimetype.startsWith('image')){
        throw new BadRequestError('Please upload an image')
    }
    if(postImage.size > maxSize) throw new BadRequestError(`Image size should not bew more than ${maxSize}`)

    const result = await cloudinary.uploader.upload(postImage.tempFilePath,
        {
            use_filename:true,
            folder:dest
        })
    res.status(StatusCodes.OK).json({image:{src:result.secure_url}})    
    fs.unlinkSync(postImage.tempFilePath)
}

module.exports = upload