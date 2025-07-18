import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwt: {
    accessToken: {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      signOptions: {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
      },
    },
    refreshToken: {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
      signOptions: {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
      },
    },
    verifyToken: {
      secret: process.env.JWT_VERIFICATION_TOKEN_SECRET_KEY,
      signOptions: {
        expiresIn: process.env.JWT_VERIFICATION_TOKEN_EXPIRES_IN,
      },
    },
  },
}));
