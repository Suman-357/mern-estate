import express  from "express";
import { createlisting, deletelisting } from "../controllers/listing.controller.js";
import { verifytoken } from "../utils/Verifyuser.js";


const router = express.Router();


router.post('/create', verifytoken, createlisting);
router.delete('/delete/:id', verifytoken, deletelisting);

export default router;