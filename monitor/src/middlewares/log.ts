export function log(req: any, res: any, next: any) {
  console.log(req.method, req.url);
  next();
}
