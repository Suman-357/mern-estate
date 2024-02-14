import express from "express";
import { deleteuser, test, upadateuser , getuserlisting} from "../controllers/user.controller.js";
import { verifytoken } from "../utils/Verifyuser.js";


const router = express.Router();

router.get('/test', test);
router.post(`/update/:id`, verifytoken, upadateuser);
router.delete(`/delete/:id`, verifytoken, deleteuser);
router.get('/listing/:id', verifytoken, getuserlisting);

export default router;