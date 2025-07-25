import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserDetailModule } from 'src/user/modules/user-detail/user-detail.module';
import { UserModel } from 'src/user/models/user.model';
import { UserModule } from 'src/user/user.module';
import { RoleModule } from 'src/role/role.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { SessionModule } from './modules/session/session.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import auth from 'src/config/auth';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => RoleModule),
    forwardRef(() => MailerModule),
    forwardRef(() => UserDetailModule),
    PassportModule,
    SessionModule,
    ConfigModule.forRoot({
      load: [auth],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get('auth.jwt') as JwtModuleOptions;
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
