import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from './entity/session.entity';
import { IsNull, Repository } from 'typeorm';
import { SessionModel } from './model/session.model';
import { SessionType } from './enums/session.type';
import { UserModel } from 'src/user/models/user.model';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  async createSession(
    user: UserModel,
    userAgent: string,
    ipAddress: string,
    type: SessionType | undefined,
    reqUserId: number,
  ): Promise<SessionModel> {
    const entity = new SessionEntity();

    entity.userId = user.id;
    entity.userAgent = userAgent;
    entity.ipAddress = ipAddress;
    entity.type = type;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;
    entity.isActive = true;

    const newSession = await this.sessionRepository.save(entity);
    return newSession.toModel();
  }

  async getSessionById(
    sessionId: number,
    isActive: boolean | undefined,
  ): Promise<SessionModel> {
    const session = await this.sessionRepository.findOne({
      where: {
        id: sessionId,
        isActive: isActive,
        deletedAt: IsNull(),
      },
    });
    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }

    return session.toModel();
  }

  async updateSession(
    session: SessionModel,
    isActive: boolean,
    type: SessionType | undefined,
    reqUserId: number,
  ): Promise<SessionModel> {
    await this.sessionRepository.update(
      {
        id: session.id,
        deletedAt: IsNull(),
      },
      {
        isActive: isActive,
        type: type,
        updatedAt: new Date(),
        updatedBy: reqUserId,
      },
    );

    return await this.getSessionById(session.id, undefined);
  }

  async invalidateAllSessionsForUser(userId: number): Promise<void> {
    await this.sessionRepository.update(
      {
        userId: userId,
        isActive: true,
        deletedAt: IsNull(),
      },
      {
        isActive: false,
        type: undefined,
        updatedAt: new Date(),
        updatedBy: userId,
      },
    );
  }
}
