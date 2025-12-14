import express from 'express';

const router = express.Router();

import { loginUser, signupUser, isAdmin } from '../controllers/user.js';

router.post('/login', loginUser);
router.post('/signup', signupUser);

// Use isAdmin middleware for admin-only routes
// Example: router.post("/admin-only-route", isAdmin, yourController)

export default router;
