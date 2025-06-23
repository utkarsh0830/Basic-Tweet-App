import { Router } from "express"
import { getCurrentUser, loginUser,registerUser } from "../controller/user.controller.js";
import verifyJWT from "../middlewares/auth.js"
const router = new Router();

router.post('/login',loginUser);

router.post('/register',registerUser);

router.get('/test-protected', verifyJWT, (req, res) => {
    res.json({
        message: "✅ Access granted to protected route",
        user: req.user, 
    });
});

router.get('/getCurrentUser',verifyJWT,getCurrentUser)


export default router;