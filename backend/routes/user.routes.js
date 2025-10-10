import {Router} from 'express';
import * as userController from '../controllers/user.controller.js'
import * as authMiddleware from '../middlware/auth.middleware.js'

const router = Router()

router.post("/register", userController.registerController)
router.post("/login", userController.loginController)
export default router