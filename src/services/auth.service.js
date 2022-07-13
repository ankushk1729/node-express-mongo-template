import BadRequestError from "../errors/badRequest.js";
import UnauthenticatedError from "../errors/unauthenticated.js";
import User from "../models/user.model.js";

const registerUser = async (req) => {
    const user = await User.create({ ...req.body, role: "user" });
    const token = user.createJWT();

    return { user, token }
}

const loginUser = async (req) => {
    const { email, password } = req.body;
    if (!email || !password)
        throw new BadRequestError("Please provide email and password");
    const user = await User.findOne({ email });

    if (!user) throw new UnauthenticatedError("Invalid email or password");
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect)
        throw new UnauthenticatedError("Invalid email or password");
        
    const token = user.createJWT();

    return { user, token }
}

export { registerUser, loginUser }