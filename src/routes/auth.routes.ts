import { Router } from "express";
import { signUp, signIn, me, signOut } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { signUpSchema, signInSchema } from "../modules/auth.schemas";
import { isLoggedIn, isAuthenticated } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", validate(signUpSchema), signUp);
router.post("/signin", validate(signInSchema), signIn);
router.delete("/signout", isLoggedIn, isAuthenticated, signOut);

router.get("/me", isLoggedIn, isAuthenticated, me);

export default router;
