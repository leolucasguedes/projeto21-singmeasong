import { Request, Response } from "express";
import { resetDatabase } from "../repositories/testRepository";

export async function reset(req: Request, res: Response) {
  await resetDatabase();

  res.sendStatus(200);
}