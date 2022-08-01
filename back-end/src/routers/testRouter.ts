import { Router } from "express";
import { reset } from "../controllers/testController.js";

const testRouter = Router();

testRouter.delete("/reset", reset);

export default testRouter;