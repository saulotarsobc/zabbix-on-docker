import { Request, Response, Router } from "express";

export const containersRouter = Router();

containersRouter.post("/getContainers", (req: Request, res: Response) => {
  console.log(req.body);
  res.send("OK");
});
