export function throwError(message = ''): never {
  throw new Error(message);
}

export function extractTokenFromHeader(req: any): string | undefined {
  const [type, token] = req.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
