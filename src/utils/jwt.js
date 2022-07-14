import jwt from "jsonwebtoken";

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const createJWT = ({ payload }) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET)
    return token
}

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
    const accessTokenJWT = createJWT({ payload: { user } });
    const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });
    
    res.cookie('accessToken', accessTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        expires: new Date(Date.now() + parseInt(process.env.ACCESS_TOKEN_EXPIRY)),
    });

    res.cookie('refreshToken', refreshTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        expires: new Date(Date.now() + parseInt(process.env.REFRESH_TOKEN_EXPIRY)),
    });
}

export { createJWT, isTokenValid, attachCookiesToResponse }