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
        .cookie('access_token', token, { httponly: true })
        .status(200)
        .json(rest);

    } catch (error) {
        next(error);
    }
}

export const google = async (req,res,next) => {
    try {
        const User = await user.findOne({ email: req.body.email });
        if (User){
            const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET)
            const { password: pass, ...rest } = User._doc;
            res
            .cookie('access_token', token, { httponly: true })
            .status(200)
            .json(rest);
    
        }
        else{
            const generatepassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedpassword = bcryptjs.hashSync(generatepassword,10);
            const newUser = new user({username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), email:req.body.email ,password:hashedpassword ,avatar:req.body.photo})
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)
            const { password: pass, ...rest } = newUser._doc;
            res
            .cookie('access_token', token, { httponly: true })
            .status(200)
            .json(rest);
        }
    } catch (error) {
        next(error);
    }
}

export const signout = (req, res, next) => {
    try {
        res.clearCookie('access_token')
        res.status(200).json('user signout successful!')
    } catch (error) {
       next(error); 
    }
}