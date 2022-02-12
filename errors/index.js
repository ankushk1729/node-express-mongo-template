const BadRequestError = require('./BadRequest')
const CustomAPIError = require('./custom-error')
const NotFoundError = require('./not-found')
const UnauthenticatedError = require('./unauthenticated')
const UnauthorizedError = require('./Unauthorized')


module.exports = {
    BadRequestError,
    CustomAPIError,
    NotFoundError,
    UnauthenticatedError,
    UnauthorizedError
}