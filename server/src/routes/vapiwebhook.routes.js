import { Router } from "express";
import { vapiWebHook } from "../controllers/vapiwebhook.controller";


const router = Router();

router.post('/vapi-webhook', vapiWebHook);

export default router;