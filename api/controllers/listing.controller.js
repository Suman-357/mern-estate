import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createlisting = async(req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
};

export const deletelisting = async(req, res, next) => {
   const listing = await Listing.findById(req.params.id);

   if (!listing){
    return next(errorHandler(404,'listing not found'));
   }

   if (req.User.id !== listing.userRef){
    return next(errorHandler(401,'you can delete only your listing'));
   }

   try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted');
   } catch (error) {
    next(error);
   }

}
export const updatelisting = async(req, res, next) => {
   const listing = await Listing.findById(req.params.id);

   if (!listing){
    return next(errorHandler(404,'listing not found'));
   }

   if (req.User.id !== listing.userRef){
    return next(errorHandler(401,'you can delete only your listing'));
   }

   try {
    const updatelisting = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
        );
    res.status(200).json(updatelisting);
   } catch (error) {
    next(error);
   }

}