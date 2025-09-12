import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, LessThan } from 'typeorm';
import { SessionEntity } from '../entities/session.entity';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
  ) {}

  /**
   * Create anonymous session for AI analysis
   */
  async createAnonymousSession(
    userAgent?: string,
    ipAddress?: string,
  ): Promise<SessionEntity> {
    const session = this.sessionRepository.create({
      userId: undefined,
      type: 'anonymous_ai',
      userAgent,
      ipAddress,
      isActive: true,
    });

    const savedSession = await this.sessionRepository.save(session);
    this.logger.log(`Created anonymous session: ${savedSession.id}`);
    return savedSession;
  }

  /**
   * Get active session by ID
   */
  async getActiveSession(sessionId: number): Promise<SessionEntity | null> {
    return await this.sessionRepository.findOne({
      where: {
        id: sessionId,
        isActive: true,
        deletedAt: IsNull(),
      },
    });
  }

  /**
   * Create session for registered user
   */
  async createUserSession(
    userId: number,
    type: string = 'web_login',
    userAgent?: string,
    ipAddress?: string,
  ): Promise<SessionEntity> {
    const session = this.sessionRepository.create({
      userId,
      type,
      userAgent,
      ipAddress,
      isActive: true,
      createdBy: userId,
    });

    const savedSession = await this.sessionRepository.save(session);
    this.logger.log(
      `Created user session: ${savedSession.id} for user: ${userId}`,
    );
    return savedSession;
  }

  /**
   * Deactivate session
   */
  async deactivateSession(
    sessionId: number,
    deactivatedBy?: number,
  ): Promise<void> {
    await this.sessionRepository.update(sessionId, {
      isActive: false,
      updatedBy: deactivatedBy,
    });

    this.logger.log(`Deactivated session: ${sessionId}`);
  }

  /**
   * Cleanup old anonymous sessions
   */
  async cleanupOldAnonymousSessions(): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 1); // 1 day old

    const result = await this.sessionRepository.update(
      {
        type: 'anonymous_ai',
        isActive: false,
        createdAt: LessThan(cutoffDate),
        deletedAt: IsNull(),
      },
      {
        deletedAt: new Date(),
      },
    );

    const affected = result.affected || 0;
    this.logger.log(`Cleaned up ${affected} old anonymous sessions`);
    return affected;
  }

  /**
   * Get session with user info
   */
  async getSessionWithUser(sessionId: number): Promise<any> {
    return await this.sessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('user', 'user', 'session.user_id = user.id')
      .leftJoinAndSelect('user_detail', 'detail', 'user.id = detail.user_id')
      .where('session.id = :sessionId', { sessionId })
      .andWhere('session.is_active = true')
      .andWhere('session.deleted_at IS NULL')
      .getOne();
  }
}
