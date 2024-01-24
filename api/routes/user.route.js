import express from "express";
import { deleteuser, test, upadateuser } from "../controllers/user.controller.js";
import { verifytoken } from "../utils/Verifyuser.js";


const router = express.Router();

router.get('/test', test);
router.post(`/update/:id`, verifytoken, upadateuser);
router.delete(`/delete/:id`, verifytoken, deleteuser);

export default router;