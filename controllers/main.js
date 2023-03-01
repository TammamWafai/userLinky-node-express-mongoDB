require('dotenv').config()
const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')

const SocialMedia = require('../models/socialMedia')
const User = require('../models/User')

const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors')
// ______________________________________




// Login
// const login = async (req, res) => {
//     const { username, password } = req.body
//     if (!username || !password) {
//         throw new BadRequestError('Please provide email and password')
//     }
//     const id = new Date().getDate()
//     const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: '30d' })
//     res.status(200).json({ msg: 'user created', token })
// }

const login = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    // const id = new Date().getDate()
    // const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: '30d' })
    const token = user.createJWT()
    console.log(token)
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}


// mainPage
const mainPage = async (req, res) => {
    res.send(`<h1>${req.params.user} Social Media links</h1>`)
}

const getUsername = async (req, res) => {
    console.log(req.body)
    const { email, password } = req.body
    console.log(email, password)
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    res.json(`{username: ${user.name}}`)
}


// Social media
const getAllSocialMedias = async (req, res) => {
    const socialMedias = await SocialMedia.find({ createdBy: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ socialMedias, count: socialMedias.length })
}
const getSocialMedia = async (req, res) => {
    const {
        user: { userId },
        params: { id: socialMediaId },
    } = req

    const socialMedia = await SocialMedia.findOne({
        _id: socialMediaId,
        createdBy: userId,
    })
    if (!socialMedia) {
        throw new NotFoundError(`No socialMedia with id ${socialMediaId}`)
    }
    res.status(StatusCodes.OK).json({ socialMedia })
}

const createSocialMedia = async (req, res) => {
    console.log(req.body);
    console.log(req.user.userId);
    req.body.createdBy = req.user.userId
    console.log(req.body);
    const socialMedia = await SocialMedia.create(req.body)
    res.status(StatusCodes.CREATED).json({ socialMedia })
}

const updateSocialMedia = async (req, res) => {
    const {
        body: { company, position },
        user: { userId },
        params: { id: socialMediaId },
    } = req

    if (company === '' || position === '') {
        throw new BadRequestError('Company or Position fields cannot be empty')
    }
    const socialMedia = await SocialMedia.findByIdAndUpdate(
        { _id: socialMediaId, createdBy: userId },
        req.body,
        { new: true, runValidators: true }
    )
    if (!socialMedia) {
        throw new NotFoundError(`No socialMedia with id ${socialMediaId}`)
    }
    res.status(StatusCodes.OK).json({ socialMedia })
}

const deleteSocialMedia = async (req, res) => {
    const {
        user: { userId },
        params: { id: socialMediaId },
    } = req

    const socialMedia = await SocialMedia.findByIdAndRemove({
        _id: socialMediaId,
        createdBy: userId,
    })
    if (!socialMedia) {
        throw new NotFoundError(`No socialMedia with id ${socialMediaId}`)
    }
    res.status(StatusCodes.OK).json({ msg: "The entry was deleted." })
}


// Register
const register = async (req, res) => {
    console.log(req.protocol + '://' + req.get('host') + req.originalUrl)
    console.log(req.body);

    const user = await User.create({ ...req.body })
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}







module.exports = {
    createSocialMedia,
    deleteSocialMedia,
    getAllSocialMedias,
    updateSocialMedia,
    getSocialMedia,
    register,
    login, mainPage, getUsername
}