import express from "express";
import { AskQuestion, getAllQuestions } from "../controllers/Questions.js";

const router = express.Router();

router.post("/Ask", AskQuestion);
router.get("/get", getAllQuestions);

export default router;
