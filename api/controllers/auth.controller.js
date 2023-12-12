import user from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 5);
    const newUser = new user({ username, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json("user created successfully!");

    } catch (error) {
        next(error);
    }
}
export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validuser = await user.findOne({ email });
        if (!validuser) return next(errorHandler(404, 'user not Found!'));
        const validpassword = bcryptjs.compareSync(password, validuser.password);
        if (!validpassword) return next(errorHandler(401, 'Username or Password is incorrect!'));
        const token = jwt.sign({ id: validuser._id }, process.env.JWT_SECRET)
        const { password: pass, ...rest } = validuser._doc;
        res
        .cookie('access token', token, { httponly: true })
        .status(200)
        .json(rest);

    } catch (error) {
        next(error);
    }
}