import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RoleModel } from 'src/role/models/role.model';
import { ConfigService } from '@nestjs/config';
import { SessionService } from './modules/session/session.service';
import ms, { StringValue } from 'ms';
import { SessionModel } from './modules/session/model/session.model';
import * as moment from 'moment';
import { PayloadModel } from './models/payload.model';
import { RoleService } from 'src/role/role.service';
import { LoginTokenModel } from './models/login-token.model';
import { EmailTemplateType } from './enums/email-template.type';
import { TokenModel } from './models/token.model';
import { JwtConfigModel } from './models/jwt-config.model';
import { SessionType } from './modules/session/enums/session.type';
import { UserService } from 'src/user/user.service';
import { throwError } from 'src/common/utils/functions';
import { UserModel } from 'src/user/models/user.model';

@Injectable()
export class AuthService {
  // public readonly accessTokenConfig: JwtConfigModel;
  // public readonly refreshTokenConfig: JwtConfigModel;
  // public readonly verifyTokenConfig: JwtConfigModel;
  // constructor(
  //   private readonly userService: UserService,
  //   private readonly roleService: RoleService,
  //   private readonly sessionService: SessionService,
  //   private readonly jwtService: JwtService,
  //   private readonly configService: ConfigService,
  // ) {
  //   this.accessTokenConfig = new JwtConfigModel(
  //     configService.get<string>('auth.jwt.accessToken.secret') ?? throwError(),
  //     configService.get<string>('auth.jwt.accessToken.signOptions.expiresIn') ??
  //       throwError(),
  //   );
  //   this.refreshTokenConfig = new JwtConfigModel(
  //     configService.get<string>('auth.jwt.refreshToken.secret') ?? throwError(),
  //     configService.get<string>(
  //       'auth.jwt.refreshToken.signOptions.expiresIn',
  //     ) ?? throwError(),
  //   );
  //   this.verifyTokenConfig = new JwtConfigModel(
  //     configService.get<string>('auth.jwt.verifyToken.secret') ?? throwError(),
  //     configService.get<string>('auth.jwt.verifyToken.signOptions.expiresIn') ??
  //       throwError(),
  //   );
  // }
  // private async generateTokenWithConfig(
  //   payload: PayloadModel,
  //   config: JwtConfigModel,
  // ): Promise<TokenModel> {
  //   const token = await this.jwtService.signAsync(
  //     payload.toJson(),
  //     config.toJson(),
  //   );
  //   const expireDate = moment()
  //     .add(ms(config.expiresIn as StringValue), 'ms')
  //     .toDate();
  //   return new TokenModel(token, expireDate);
  // }
  // async login(
  //   username: string,
  //   password: string,
  //   userAgent: string,
  //   ipAddress: string,
  // ): Promise<LoginTokenModel> {
  //   const account = await this.userService.getAccountByUsername(
  //     username,
  //     false,
  //   );
  //   const role = await this.roleService.getRole(account.roleId);
  //   const isMatch = await bcrypt.compare(
  //     password,
  //     account.password ?? throwError('Not Found Password'),
  //   );
  //   if (!isMatch) {
  //     throw new UnauthorizedException('Username or password is invalid');
  //   }
  //   const type = SessionType.LOGIN;
  //   const session = await this.sessionService.createSession(
  //     account,
  //     userAgent,
  //     ipAddress,
  //     type,
  //     account.id,
  //   );
  //   const payload = new PayloadModel(
  //     account.id,
  //     session.id,
  //     account.email,
  //     account.roleId,
  //     role.name,
  //   );
  //   return await this.generateToken(payload);
  // }
  // async logout(session: SessionModel, reqAccountId: number): Promise<boolean> {
  //   const sessionType = SessionType.LOGOUT;
  //   await this.sessionService.updateSession(
  //     session,
  //     false,
  //     sessionType,
  //     reqAccountId,
  //   );
  //   return true;
  // }
  // async register(
  //   username: string,
  //   password: string,
  //   email: string,
  //   role: RoleModel,
  //   reqAccountId: number,
  // ): Promise<UserModel> {
  //   const newAccount = await this.userService.createUser(
  //     username,
  //     password,
  //     email,
  //     role.id,
  //     reqAccountId,
  //   );
  //   await this.accountDetailService.createAccountDetail(
  //     newAccount.id,
  //     undefined,
  //     undefined,
  //     undefined,
  //     undefined,
  //     undefined,
  //   );
  //   return await this.accountService.getAccount(newAccount.id, true);
  // }
  // async generateToken(payload: PayloadModel): Promise<LoginTokenModel> {
  //   const accessToken = await this.generateTokenWithConfig(
  //     payload,
  //     this.accessTokenConfig,
  //   );
  //   const refreshToken = await this.generateTokenWithConfig(
  //     payload,
  //     this.refreshTokenConfig,
  //   );
  //   return new LoginTokenModel(payload.accountId, accessToken, refreshToken);
  // }
  // async requestResetPassword(
  //   session: SessionModel,
  //   account: AccountModel,
  //   email: string,
  // ): Promise<boolean> {
  //   await this.accountService.getAccountByEmail(account.email);
  //   if (!account) {
  //     throw new UnauthorizedException('Email not exist');
  //   }
  //   await this.sessionService.updateSession(
  //     session,
  //     false,
  //     SessionType.RESET_PASSWORD,
  //     account.id,
  //   );
  //   const resetToken = await this.generateTokenWithConfig(
  //     new PayloadModel(
  //       account.id,
  //       session.id,
  //       account.email,
  //       account.roleId,
  //       (await this.roleService.getRole(account.roleId)).name,
  //     ),
  //     this.verifyTokenConfig,
  //   );
  //   const resetUrl = `${this.configService.get('EMAIL_RESET_PASSWORD_URL')}?token=${resetToken.token}`;
  //   const expiresIn = moment
  //     .duration(moment(resetToken.expireDate).diff(moment()))
  //     .humanize();
  //   await this.mailerService.sendMailWithTemplate(
  //     email,
  //     EmailTemplateType.RESET_PASSWORD,
  //     {
  //       resetUrl: resetUrl,
  //       username: account.username,
  //       expiresIn: expiresIn,
  //     },
  //   );
  //   return true;
  // }
  // async resetPassword(token: string, newPassword: string): Promise<boolean> {
  //   const payload = await this.jwtService.verifyAsync(token, {
  //     secret: this.verifyTokenConfig.secret,
  //   });
  //   const account = await this.accountService.getAccount(
  //     payload.accountId,
  //     false,
  //   );
  //   await this.accountService.updateAccount(
  //     account,
  //     undefined,
  //     newPassword,
  //     undefined,
  //     undefined,
  //   );
  //   await this.sessionService.invalidateAllSessionsForAccount(account.id);
  //   return true;
  // }
  // async changePassword(
  //   account: AccountModel,
  //   oldPassword: string,
  //   newPassword: string,
  // ): Promise<AccountModel> {
  //   const isMatch = await bcrypt.compare(
  //     oldPassword,
  //     account.password ?? throwError('Not Found Password'),
  //   );
  //   if (!isMatch) {
  //     throw new UnauthorizedException('Old password is incorrect');
  //   }
  //   await this.accountService.updateAccount(
  //     account,
  //     undefined,
  //     newPassword,
  //     undefined,
  //     account.id,
  //   );
  //   return this.accountService.getAccount(account.id, true);
  // }
  // // RESET PASSWORD OTP METHODS
  // // async requestResetPasswordOtp(email: string): Promise<void> {
  // //   const account = await this.accountService.checkExistEmail(email);
  // //   if (!account) {
  // //     throw new UnauthorizedException('Email does not exist');
  // //   }
  // //   const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // //   const hashedOtp = await bcrypt.hash(otp, SALT_OR_ROUNDS);
  // //   const expiresAt = new Date(Date.now() + ms('5m'));
  // //   const otpRecord = this.otpRepository.create({
  // //     accountId: account?.id,
  // //     email,
  // //     otpCode: hashedOtp,
  // //     createdAt: new Date(),
  // //     expiresAt,
  // //     isUse: false,
  // //   });
  // //   await this.otpRepository.save(otpRecord);
  // //   await this.mailerService.sendMail({
  // //     to: email,
  // //     subject: 'Password Reset OTP',
  // //     html: `Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.`,
  // //   });
  // // }
  // // async resetPassword(
  // //   email: string,
  // //   otp: string,
  // //   newPassword: string,
  // // ): Promise<void> {
  // //   const otpRecord = await this.otpRepository.findOne({
  // //     where: {
  // //       email,
  // //       isUse: false,
  // //       expiresAt: MoreThan(new Date()),
  // //     },
  // //   });
  // //   if (!otpRecord) {
  // //     throw new BadRequestException('Invalid or expired OTP');
  // //   }
  // //   const isValid = await bcrypt.compare(otp, otpRecord.otpCode);
  // //   if (!isValid) {
  // //     throw new BadRequestException('Invalid OTP');
  // //   }
  // //   const hashedPassword = await bcrypt.hash(newPassword, 10);
  // //   await this.accountService.updateAccount(
  // //     await this.accountService.getAccount(otpRecord.accountId),
  // //     undefined,
  // //     hashedPassword,
  // //     undefined,
  // //     undefined,
  // //   );
  // //   otpRecord.isUse = true;
  // //   await this.otpRepository.save(otpRecord);
  // //   await this.otpRepository.delete({
  // //     email,
  // //     id: Not(otpRecord.id),
  // //   });
  // // }
  // // async changePassword(
  // //   accountId: number,
  // //   oldPassword: string,
  // //   newPassword: string,
  // // ): Promise<void> {
  // //   const account = await this.accountService.getAccount(accountId);
  // //   const isMatch = await bcrypt.compare(oldPassword, account.password);
  // //   if (!isMatch) {
  // //     throw new UnauthorizedException('Old password is incorrect');
  // //   }
  // //   const hashedNewPassword = await bcrypt.hash(newPassword, SALT_OR_ROUNDS);
  // //   await this.accountService.updateAccount(
  // //     account,
  // //     undefined,
  // //     hashedNewPassword,
  // //     undefined,
  // //     accountId,
  // //   );
  // // }
  // // async forgotPassword(email: string): Promise<void> {
  // //   const payload = { email };
  // //   const verifyToken = this.jwtService.sign(payload, {
  // //     secret: this.configService.get<string>('auth.jwt.verifyToken.secret'),
  // //   });
  // //   const verifyTokenExpire = this.configService.get<string>(
  // //     'auth.jwt.verifyToken.signOptions.expiresIn',
  // //   );
  // //   const verifyExpireDate = moment()
  // //     .add(ms(verifyTokenExpire as StringValue), 'ms')
  // //     .toDate();
  // //   const user = await this.accountService.checkExistEmail(email);
  // //   if (!user) {
  // //     throw new BadRequestException('Email does not exist');
  // //   }
  // //   const url = `${this.configService.get('EMAIL_RESET_PASSWORD_URL')}?token=${verifyToken}`;
  // //   const text = `Hi,\nTo reset your password, click here: ${url}`;
  // //   await this.mailerService.sendMail({
  // //     to: email,
  // //     subject: 'Reset password',
  // //     text,
  // //   });
  // // }
}
