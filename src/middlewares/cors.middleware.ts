import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const allowedOrigins = [
      'http://localhost:3002',
      'https://localhost:3002',
      'https://matnice-ecommerce-frontend.vercel.app',
      'http://matnice.id.vn',
      'https://matnice.id.vn',
      'https://api.matnice.id.vn',
      'http://13.54.93.54',
      'https://13.54.93.54',
    ];

    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(204).send();
      return;
    }

    next();
  }
}
