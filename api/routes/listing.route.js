import express  from "express";
import { createlisting, deletelisting, updatelisting, getlisting } from "../controllers/listing.controller.js";
import { verifytoken } from "../utils/Verifyuser.js";


const router = express.Router();


router.post('/create', verifytoken, createlisting);
router.delete('/delete/:id', verifytoken, deletelisting);
router.post('/update/:id', verifytoken, updatelisting);
router.get('/get/:id', getlisting);

export default router;