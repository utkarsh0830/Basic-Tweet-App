import { Router } from "express"
import { loginUser,registerUser } from "../controller/user.controller";

const router = new Router();

router.post('/login',loginUser);
router.post('/register',registerUser);