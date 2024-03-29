import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import user from "../models/user.model.js";
import Listing from '../models/listing.model.js';

export const test = (req, res) => {
    res.json({
        message: 'hi alpha',
    });
};

export const upadateuser = async (req, res, next) => {
    if (req.User.id !== req.params.id)
        return next(errorHandler(401, 'you are not authenticated'));

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password);

        }

        const updateduser = await user.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar,
                }
            }, { new: true });

        const { password, ...rest} = updateduser._doc;
        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }
}

export const deleteuser = async(req,res,next) =>{
    if (req.User.id !== req.params.id)
    return next(errorHandler(401, 'you can only delete your account'));

    try {
       await user.findByIdAndDelete(req.params.id);
       res.clearCookie('access_token');
       res.status(200).json('user has beem deleted!')
    } catch (error) {
        next(error);
    }
}

export const getuserlisting = async (req,res,next) => {

    if(req.User.id === req.params.id) {
        try {
            const listings = await Listing.find({ userRef : req.params.id });
            res.status(200).json(listings)
        } catch (error) {
            next(error);
        }
    }
    else{
            return next(errorHandler('you can view only ur listings!'));
    }
    


}

export const getuser = async(req,res,next) => {
    try {
        
        const User = await user.findById(req.params.id);
    
        if (!User) return next(errorHandler(404,'user not found!'))
    
        const {password: pass, ...rest} = User._doc;
    
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}

