import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import user from "../models/user.model.js";

export const test = (req,res)=> {
    res.json({
        message: 'hi alpha',
    });
};

export const upadateuser = async (req,res,next) => {
    if(req.user.id != req.params.id) 
        return next(errorHandler(401,'you are not authenticated'));

    try {
        if(req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password)

        }

        const updateduser = await user.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar,
                },
            },

            { new: true }

        );

            const { password, ...rest} =  updateduser._doc

            res.status(200).json(rest)

    } catch (error) {
        next(error)
    }
}