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

export const getlisting = async(req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if(!listing){
            return next(errorHandler(404,'listing not found'))
        }
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
}

export const getlistings = async(req,res,next) => {
try {
    
const limit = parseInt(req.query.limit) || 9;
const startindex = parseInt(req.query.startindex) || 0;
let offer = req.query.offer;

if(offer === undefined || offer === 'false'){
    offer = { $in: [false, true] }
}

let furnished = req.query.offer;

if(furnished === undefined || furnished === 'false'){
    furnished = { $in: [false, true] }
}

let parking = req.query.offer;

if(parking === undefined || parking === 'false'){
    parking = { $in: [false, true] }
}
let type = req.query.type;

if(type === undefined || type === 'all'){
    type = { $in: ['sale', 'rent'] }
}
const searchTerm = req.query.searchTerm || '';
const sort = req.query.sort || 'createdAt';
const order = req.query.order || 'desc';

const listings = await Listing.find({
    name: { $regex: searchTerm, $options: 'i' },
    offer,
    furnished,
    parking,
    type,

}).sort(
    {[sort] : order}
).limit(limit).skip(startindex);

return res.status(200).json(listings);
} catch (error) {
    next(error)
}



}
