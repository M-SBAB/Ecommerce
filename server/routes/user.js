import express from "express"

const router = express.Router()

import { loginUser, signupUser} from "../controllers/user.js"

router.post("/login", loginUser)
router.post("/signup", signupUser)

export default router;
