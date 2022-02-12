const {UnauthorizedError} = require('../errors')

const checkPermissions = (requestUser,resourceUserId) => {
    if(requestUser.role === 'admin' || requestUser.userId === resourceUserId.toString()){
        return
    }
    throw new UnauthorizedError('Access forbidden')
}

module.exports = checkPermissions