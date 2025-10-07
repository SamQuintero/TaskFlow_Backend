import { Router, json } from "express";
import { getUsers } from "../controllers/users";
import { authMiddelware } from "../middelwares/auth";

const router = Router();


router.use(json());

router.use(authMiddelware)
router.get('',authMiddelware ,getUsers);

export default router;