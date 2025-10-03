import { Router } from "express";
import { login, signup} from "../controllers/auth";
import { authMiddelware } from "../middelwares/auth";

const router = Router();

router.use(authMiddelware)
router.post('/login', login);
router.post('/signup', signup);

export default router;