import { NextFunction, Request, Response } from "express";

export function validateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "Token não fornecido" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (token !== process.env.AUTH_TOKEN) {
    res.status(403).json({ error: "Token inválido" });
    return;
  }

  next();
}
