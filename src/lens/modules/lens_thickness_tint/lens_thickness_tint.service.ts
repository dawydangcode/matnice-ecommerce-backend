import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, In } from 'typeorm';
import { LensThicknessTintEntity } from './entities/lens_thickness_tint.entity';
import { LensThicknessTintModel } from './models/lens_thickness_tint.model';
import {
  CreateLensThicknessTintDto,
  CreateBulkLensThicknessTintDto,
  CreateTintThicknessCompatibilityDto,
  UpdateLensThicknessTintDto,
} from './dtos/lens_thickness_tint.dto';

@Injectable()
export class LensThicknessTintService {
  constructor(
    @InjectRepository(LensThicknessTintEntity)
    private readonly lensThicknessTintRepository: Repository<LensThicknessTintEntity>,
  ) {}

  async findAll(): Promise<LensThicknessTintModel[]> {
    const relationships = await this.lensThicknessTintRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['lensThickness', 'lensTint'],
      order: { createdAt: 'DESC' },
    });

    return relationships.map((rel) => rel.toModel());
  }

  async findById(id: number): Promise<LensThicknessTintModel> {
    const relationship = await this.lensThicknessTintRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['lensThickness', 'lensTint'],
    });

    if (!relationship) {
      throw new HttpException(
        'Lens thickness-tint relationship not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return relationship.toModel();
  }

  async findByThicknessId(
    lensThicknessId: number,
  ): Promise<LensThicknessTintModel[]> {
    const relationships = await this.lensThicknessTintRepository.find({
      where: { lensThicknessId, deletedAt: IsNull() },
      relations: ['lensThickness', 'lensTint'],
      order: { createdAt: 'DESC' },
    });

    return relationships.map((rel) => rel.toModel());
  }

  async findByTintId(tintId: number): Promise<LensThicknessTintModel[]> {
    const relationships = await this.lensThicknessTintRepository.find({
      where: { tintId, deletedAt: IsNull() },
      relations: ['lensThickness', 'lensTint'],
      order: { createdAt: 'DESC' },
    });

    return relationships.map((rel) => rel.toModel());
  }

  async getCompatibleTintsForThickness(
    lensThicknessId: number,
  ): Promise<any[]> {
    const relationships = await this.lensThicknessTintRepository.find({
      where: { lensThicknessId, deletedAt: IsNull() },
      relations: ['lensTint'],
    });

    return relationships.map((rel) => ({
      id: rel.lensTint.id,
      name: rel.lensTint.name,
      price: rel.lensTint.price,
      description: rel.lensTint.description,
    }));
  }

  async getCompatibleThicknessesForTint(tintId: number): Promise<any[]> {
    const relationships = await this.lensThicknessTintRepository.find({
      where: { tintId, deletedAt: IsNull() },
      relations: ['lensThickness'],
    });

    return relationships.map((rel) => ({
      id: rel.lensThickness.id,
      name: rel.lensThickness.name,
      indexValue: rel.lensThickness.indexValue,
      price: rel.lensThickness.price,
      description: rel.lensThickness.description,
    }));
  }

  async create(
    createDto: CreateLensThicknessTintDto,
    reqUserId: number,
  ): Promise<LensThicknessTintModel> {
    // Check if relationship already exists
    const existingRelationship = await this.lensThicknessTintRepository.findOne(
      {
        where: {
          lensThicknessId: createDto.lensThicknessId,
          tintId: createDto.tintId,
          deletedAt: IsNull(),
        },
      },
    );

    if (existingRelationship) {
      throw new HttpException(
        'This thickness-tint relationship already exists',
        HttpStatus.CONFLICT,
      );
    }

    const entity = new LensThicknessTintEntity();
    entity.lensThicknessId = createDto.lensThicknessId;
    entity.tintId = createDto.tintId;
    entity.createdAt = new Date();
    entity.createdBy = reqUserId;

    const savedRelationship =
      await this.lensThicknessTintRepository.save(entity);
    return savedRelationship.toModel();
  }

  async createBulkForThickness(
    createBulkDto: CreateBulkLensThicknessTintDto,
    reqUserId: number,
  ): Promise<LensThicknessTintModel[]> {
    const { lensThicknessId, tintIds } = createBulkDto;

    // Check for existing relationships
    const existingRelationships = await this.lensThicknessTintRepository.find({
      where: {
        lensThicknessId,
        tintId: In(tintIds),
        deletedAt: IsNull(),
      },
    });

    const existingTintIds = existingRelationships.map((rel) => rel.tintId);
    const newTintIds = tintIds.filter(
      (tintId) => !existingTintIds.includes(tintId),
    );

    if (newTintIds.length === 0) {
      throw new HttpException(
        'All specified tint relationships already exist for this thickness',
        HttpStatus.CONFLICT,
      );
    }

    const entities = newTintIds.map((tintId) => {
      const entity = new LensThicknessTintEntity();
      entity.lensThicknessId = lensThicknessId;
      entity.tintId = tintId;
      entity.createdAt = new Date();
      entity.createdBy = reqUserId;
      return entity;
    });

    const savedRelationships =
      await this.lensThicknessTintRepository.save(entities);
    return savedRelationships.map((rel) => rel.toModel());
  }

  async createTintCompatibility(
    createDto: CreateTintThicknessCompatibilityDto,
    reqUserId: number,
  ): Promise<LensThicknessTintModel[]> {
    const { tintId, lensThicknessIds } = createDto;

    // Check for existing relationships
    const existingRelationships = await this.lensThicknessTintRepository.find({
      where: {
        tintId,
        lensThicknessId: In(lensThicknessIds),
        deletedAt: IsNull(),
      },
    });

    const existingThicknessIds = existingRelationships.map(
      (rel) => rel.lensThicknessId,
    );
    const newThicknessIds = lensThicknessIds.filter(
      (thicknessId) => !existingThicknessIds.includes(thicknessId),
    );

    if (newThicknessIds.length === 0) {
      throw new HttpException(
        'All specified thickness relationships already exist for this tint',
        HttpStatus.CONFLICT,
      );
    }

    const entities = newThicknessIds.map((lensThicknessId) => {
      const entity = new LensThicknessTintEntity();
      entity.lensThicknessId = lensThicknessId;
      entity.tintId = tintId;
      entity.createdAt = new Date();
      entity.createdBy = reqUserId;
      return entity;
    });

    const savedRelationships =
      await this.lensThicknessTintRepository.save(entities);
    return savedRelationships.map((rel) => rel.toModel());
  }

  async update(
    id: number,
    updateDto: UpdateLensThicknessTintDto,
    reqUserId: number,
  ): Promise<LensThicknessTintModel> {
    const relationship = await this.lensThicknessTintRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!relationship) {
      throw new HttpException(
        'Lens thickness-tint relationship not found',
        HttpStatus.NOT_FOUND,
      );
    }

    // If updating the relationship, check for conflicts
    if (updateDto.lensThicknessId || updateDto.tintId) {
      const checkThicknessId =
        updateDto.lensThicknessId || relationship.lensThicknessId;
      const checkTintId = updateDto.tintId || relationship.tintId;

      const existingRelationship =
        await this.lensThicknessTintRepository.findOne({
          where: {
            lensThicknessId: checkThicknessId,
            tintId: checkTintId,
            deletedAt: IsNull(),
          },
        });

      if (existingRelationship && existingRelationship.id !== id) {
        throw new HttpException(
          'This thickness-tint relationship already exists',
          HttpStatus.CONFLICT,
        );
      }
    }

    const updateData: Partial<LensThicknessTintEntity> = {
      ...updateDto,
      updatedAt: new Date(),
      updatedBy: reqUserId,
    };

    await this.lensThicknessTintRepository.update(
      { id, deletedAt: IsNull() },
      updateData,
    );

    return this.findById(id);
  }

  async delete(id: number, reqUserId: number): Promise<boolean> {
    const relationship = await this.lensThicknessTintRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!relationship) {
      throw new HttpException(
        'Lens thickness-tint relationship not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.lensThicknessTintRepository.update(
      { id },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }

  async deleteByThicknessAndTint(
    lensThicknessId: number,
    tintId: number,
    reqUserId: number,
  ): Promise<boolean> {
    const relationship = await this.lensThicknessTintRepository.findOne({
      where: { lensThicknessId, tintId, deletedAt: IsNull() },
    });

    if (!relationship) {
      throw new HttpException(
        'Lens thickness-tint relationship not found',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.lensThicknessTintRepository.update(
      { id: relationship.id },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }

  async removeAllTintsFromThickness(
    lensThicknessId: number,
    reqUserId: number,
  ): Promise<boolean> {
    const relationships = await this.lensThicknessTintRepository.find({
      where: { lensThicknessId, deletedAt: IsNull() },
    });

    if (relationships.length === 0) {
      return true; // Nothing to delete
    }

    const relationshipIds = relationships.map((rel) => rel.id);

    await this.lensThicknessTintRepository.update(
      { id: In(relationshipIds) },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }

  async removeAllThicknessesFromTint(
    tintId: number,
    reqUserId: number,
  ): Promise<boolean> {
    const relationships = await this.lensThicknessTintRepository.find({
      where: { tintId, deletedAt: IsNull() },
    });

    if (relationships.length === 0) {
      return true; // Nothing to delete
    }

    const relationshipIds = relationships.map((rel) => rel.id);

    await this.lensThicknessTintRepository.update(
      { id: In(relationshipIds) },
      {
        deletedAt: new Date(),
        deletedBy: reqUserId,
      },
    );

    return true;
  }

  // Utility method to check if a thickness-tint combination is compatible
  async isCompatible(
    lensThicknessId: number,
    tintId: number,
  ): Promise<boolean> {
    const relationship = await this.lensThicknessTintRepository.findOne({
      where: { lensThicknessId, tintId, deletedAt: IsNull() },
    });

    return !!relationship;
  }

  // Get compatibility matrix (useful for admin dashboard)
  async getCompatibilityMatrix(): Promise<any> {
    const relationships = await this.lensThicknessTintRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['lensThickness', 'lensTint'],
    });

    const matrix: { [key: string]: { [key: string]: boolean } } = {};

    relationships.forEach((rel) => {
      const thicknessName = rel.lensThickness.name;
      const tintName = rel.lensTint.name;

      if (!matrix[thicknessName]) {
        matrix[thicknessName] = {};
      }

      matrix[thicknessName][tintName] = true;
    });

    return matrix;
  }
}
