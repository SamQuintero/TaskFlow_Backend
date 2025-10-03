import { Router } from "express";
import { getUsers } from "../controllers/users";
import { authMiddelware } from "../middelwares/auth";

const router = Router();

router.use(authMiddelware)
router.get('',authMiddelware ,getUsers);

export default router;