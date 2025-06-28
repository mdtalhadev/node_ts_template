import {Router} from "express";
import { loginUser,registerUser, forgotPassword, resetPassword,refreshToken} from "./controller";
import { upload } from "@utils/multerUtil";

const router = Router();

router.post("/register", upload.single("image"),registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshToken);


export default router;