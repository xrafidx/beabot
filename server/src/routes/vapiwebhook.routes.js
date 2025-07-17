import { Router } from "express";
import { vapiWebHook } from "../controllers/vapiwebhook.controller.js";


const router = Router();

router.post('/vapi-webhook', vapiWebHook);

export {router};