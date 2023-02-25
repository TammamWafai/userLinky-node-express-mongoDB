// const SocialMedia = require('../models/socialMedia')
// const { StatusCodes } = require('http-status-codes')
// const { BadRequestError, NotFoundError } = require('../errors')

// const getAllSocialMedias = async (req, res) => {
//     const socialMedias = await SocialMedia.find({ createdBy: req.user.userId }).sort('createdAt')
//     res.status(StatusCodes.OK).json({ socialMedias, count: socialMedias.length })
// }
// const getSocialMedia = async (req, res) => {
//     const {
//         user: { userId },
//         params: { id: socialMediaId },
//     } = req

//     const socialMedia = await SocialMedia.findOne({
//         _id: socialMediaId,
//         createdBy: userId,
//     })
//     if (!socialMedia) {
//         throw new NotFoundError(`No socialMedia with id ${socialMediaId}`)
//     }
//     res.status(StatusCodes.OK).json({ socialMedia })
// }

// const createSocialMedia = async (req, res) => {
//     console.log(req.body);
//     console.log(req.user.userId);
//     req.body.createdBy = req.user.userId
//     console.log(req.body);
//     const socialMedia = await SocialMedia.create(req.body)
//     res.status(StatusCodes.CREATED).json({ socialMedia })
// }

// const updateSocialMedia = async (req, res) => {
//     const {
//         body: { company, position },
//         user: { userId },
//         params: { id: socialMediaId },
//     } = req

//     if (company === '' || position === '') {
//         throw new BadRequestError('Company or Position fields cannot be empty')
//     }
//     const socialMedia = await SocialMedia.findByIdAndUpdate(
//         { _id: socialMediaId, createdBy: userId },
//         req.body,
//         { new: true, runValidators: true }
//     )
//     if (!socialMedia) {
//         throw new NotFoundError(`No socialMedia with id ${socialMediaId}`)
//     }
//     res.status(StatusCodes.OK).json({ socialMedia })
// }

// const deleteSocialMedia = async (req, res) => {
//     const {
//         user: { userId },
//         params: { id: socialMediaId },
//     } = req

//     const socialMedia = await SocialMedia.findByIdAndRemove({
//         _id: socialMediaId,
//         createdBy: userId,
//     })
//     if (!socialMedia) {
//         throw new NotFoundError(`No socialMedia with id ${socialMediaId}`)
//     }
//     res.status(StatusCodes.OK).json({ msg: "The entry was deleted." })
// }

// module.exports = {
//     createSocialMedia,
//     deleteSocialMedia,
//     getAllSocialMedias,
//     updateSocialMedia,
//     getSocialMedia,
// }