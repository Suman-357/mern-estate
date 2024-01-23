import express from "express";
import { test, upadateuser } from "../controllers/user.controller.js";
import { verifytoken } from "../utils/Verifyuser.js";


const router = express.Router();

router.get('/test', test);
router.post('/update/:id',verifytoken,upadateuser);

export default router;