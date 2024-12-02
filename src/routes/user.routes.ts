import { Router } from "express";
import { isLoggedIn, isAuthenticated } from "../middleware/auth.middleware";
import { create, list, update, remove } from "../controllers/user.controller";
import {
  userCreateSchema,
  userListSchema,
  userUpdateSchema,
  userDeleteSchema,
} from "../modules/user.schemas";
import { validate } from "../middleware/validate";

const router = Router();

router.post(
  "/",
  isLoggedIn,
  isAuthenticated,
  validate(userCreateSchema),
  create
);
router.get("/", isLoggedIn, isAuthenticated, validate(userListSchema), list);
router.put(
  "/:id",
  isLoggedIn,
  isAuthenticated,
  validate(userUpdateSchema),
  update
);
router.delete(
  "/:id",
  isLoggedIn,
  isAuthenticated,
  validate(userDeleteSchema),
  remove
);

export default router;
