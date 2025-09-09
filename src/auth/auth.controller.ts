import { Body, Controller, Post, Put, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthSignInBodyDto,
  AuthSignUpBodyDto,
  ChangePasswordBodyDto,
  RequestResetPasswordBodyDto,
  ResetPasswordBodyDto,
} from './dtos/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { RoleService } from 'src/role/role.service';
import { Public } from 'src/middlewares/guards/jwt-auth.guard';
import { RoleType } from 'src/role/enum/role.enum';
import { SessionService } from './modules/session/session.service';
import { SessionType } from './modules/session/enums/session.type';
import { UserService } from 'src/user/user.service';
import { RequestModel } from 'src/common/models/request.model';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly sessionService: SessionService,
  ) {}

  @Public()
  @Post('login')
  async login(@Req() req: any, @Body() body: AuthSignInBodyDto) {
    const userAgent = req.get('User-Agent');
    const ipAddress = req.ip || req.get('X-Forwarded-For');

    return await this.authService.login(
      body.username,
      body.password,
      userAgent,
      ipAddress,
    );
  }

  @Post('logout')
  async logout(@Req() req: RequestModel) {
    const sessionId = req.user.sessionId;
    const session = await this.sessionService.getSessionById(sessionId, true);
    return await this.authService.logout(session, req.user.userId);
  }

  @Public()
  @Post('register')
  async signUp(@Req() req: RequestModel, @Body() body: AuthSignUpBodyDto) {
    const role = await this.roleService.getRoleByName(RoleType.User);
    const user = await this.authService.register(
      body.username,
      body.password,
      body.email,
      role,
      0,
    );
    return user;
  }

  @Public()
  @Post('forgot-password/send-mail')
  async requestForgotPassword(
    @Req() req: any,
    @Body() body: RequestResetPasswordBodyDto,
  ) {
    const userAgent = req.get('User-Agent');
    const ipAddress = req.ip || req.get('X-Forwarded-For');
    const account = await this.userService.getUserByEmail(body.email, true);
    if (!account) {
      throw new Error('Account not found');
    }
    const session = await this.sessionService.createSession(
      account,
      req.get('User-Agent'),
      req.ip || req.get('X-Forwarded-For'),
      SessionType.RESET_PASSWORD,
      account.id,
    );
    await this.authService.requestResetPassword(session, account, body.email);
    return true;
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordBodyDto) {
    await this.authService.resetPassword(body.token, body.newPassword);
    return true;
  }

  @Post('change-password')
  async changePassword(
    @Req() req: RequestModel,
    @Body() body: ChangePasswordBodyDto,
  ) {
    const user = await this.userService.getUserById(req.user.userId, false);
    return await this.authService.changePassword(
      user,
      body.oldPassword,
      body.newPassword,
    );
  }

  // @Post('request-reset-password-authenticated')
  // async requestResetPasswordAuthenticated(@Req() req: RequestModel) {
  //   const email = req.user.email;
  //   await this.authService.requestResetPasswordOtp(email);
  //   return true;
  // }

  // @Post('reset-password-authenticated')
  // async resetPasswordAuthenticated(
  //   @Req() req: RequestModel,
  //   @Body() body: ResetPasswordBodyDto,
  // ) {
  //   const email = req.user.email;
  //   await this.authService.resetPassword(email, body.otpCode, body.newPassword);
  //   return true;
  // }

  // @Post('change-password')
  // async changePassword(
  //   @Req() req: RequestModel,
  //   @Body() body: ChangePasswordBodyDto,
  // ) {
  //   await this.authService.changePassword(
  //     req.user.accountId,
  //     body.oldPassword,
  //     body.newPassword,
  //   );
  //   return true;
  // }

  // @Public()
  // @Post('forgot-password')
  // async forgotPassword(@Body() body: RequestOtpBodyDto): Promise<void> {
  //   return this.authService.forgotPassword(body.email);
  // }

  // @Public()
  // @Post('reset-password')
  // async resetPassword(
  //   @Req() req: RequestModel,
  //   @Body() body: ResetPasswordBodyDto,
  // ): Promise<void> {
  //   return this.authService.resetPassword(
  //     req.user.email,
  //     body.otpCode,
  //     body.newPassword,
  //   );
  // }
}
