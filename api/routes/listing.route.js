import express  from "express";
import { createlisting, deletelisting, updatelisting } from "../controllers/listing.controller.js";
import { verifytoken } from "../utils/Verifyuser.js";


const router = express.Router();


router.post('/create', verifytoken, createlisting);
router.delete('/delete/:id', verifytoken, deletelisting);
router.post('/update/:id', verifytoken, updatelisting)

export default router;