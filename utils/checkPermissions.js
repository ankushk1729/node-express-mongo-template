const {UnauthorizedError} = require('../errors')

const checkPermissions = (requestUser,resourceUser) => {
    if(requestUser.role === 'admin' || requestUser.username === resourceUser){
        return
    }
    throw new UnauthorizedError('Access forbidden')
}

module.exports = checkPermissions