import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderLensDetailEntity } from './entities/order-lens-detail.entity';
import { OrderLensDetailModel } from './models/order-lens-detail.model';
import {
  CreateOrderLensDetailDto,
  UpdateOrderLensDetailDto,
  OrderLensDetailResponseDto,
} from './dtos/order-lens-detail.dto';

@Injectable()
export class OrderLensDetailService {
  constructor(
    @InjectRepository(OrderLensDetailEntity)
    private readonly orderLensDetailRepository: Repository<OrderLensDetailEntity>,
  ) {}

  async create(
    createDto: CreateOrderLensDetailDto,
  ): Promise<OrderLensDetailResponseDto> {
    try {
      console.log(
        '[OrderLensDetailService] Creating lens detail with DTO:',
        createDto,
      );

      const orderLensDetailEntity = this.orderLensDetailRepository.create({
        ...createDto,
        updatedBy: createDto.createdBy,
      });

      console.log(
        '[OrderLensDetailService] Created entity:',
        orderLensDetailEntity,
      );

      const savedEntity = await this.orderLensDetailRepository.save(
        orderLensDetailEntity,
      );

      console.log('[OrderLensDetailService] Saved lens detail successfully');
      const model = savedEntity.toModel();
      return this.mapToResponseDto(model);
    } catch (error) {
      console.error(
        '[OrderLensDetailService] Error creating lens detail:',
        error,
      );
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack =
        error instanceof Error ? error.stack : 'No stack trace';
      console.error('[OrderLensDetailService] Error message:', errorMessage);
      console.error('[OrderLensDetailService] Error stack:', errorStack);
      throw new BadRequestException(
        `Failed to create order lens detail: ${errorMessage}`,
      );
    }
  }

  async findAll(): Promise<OrderLensDetailResponseDto[]> {
    const entities = await this.orderLensDetailRepository.find({
      relations: ['orderItem'],
      order: { createdAt: 'DESC' },
    });

    return entities.map((entity) => this.mapToResponseDto(entity.toModel()));
  }

  async findOne(id: number): Promise<OrderLensDetailResponseDto> {
    const entity = await this.orderLensDetailRepository.findOne({
      where: { id },
      relations: ['orderItem'],
    });

    if (!entity) {
      throw new NotFoundException(`Order lens detail with ID ${id} not found`);
    }

    return this.mapToResponseDto(entity.toModel());
  }

  async findByOrderItemId(
    orderItemId: number,
  ): Promise<OrderLensDetailResponseDto[]> {
    const entities = await this.orderLensDetailRepository.find({
      where: { orderItemId },
      relations: ['orderItem'],
      order: { createdAt: 'DESC' },
    });

    return entities.map((entity) => this.mapToResponseDto(entity.toModel()));
  }

  async update(
    id: number,
    updateDto: UpdateOrderLensDetailDto,
  ): Promise<OrderLensDetailResponseDto> {
    const entity = await this.orderLensDetailRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`Order lens detail with ID ${id} not found`);
    }

    try {
      await this.orderLensDetailRepository.update(id, {
        ...updateDto,
        updatedAt: new Date(),
      });

      const updatedEntity = await this.orderLensDetailRepository.findOne({
        where: { id },
        relations: ['orderItem'],
      });

      return this.mapToResponseDto(updatedEntity!.toModel());
    } catch (error) {
      throw new BadRequestException('Failed to update order lens detail');
    }
  }

  async remove(id: number, deletedBy: number): Promise<void> {
    const entity = await this.orderLensDetailRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`Order lens detail with ID ${id} not found`);
    }

    try {
      await this.orderLensDetailRepository.softDelete(id);
      await this.orderLensDetailRepository.update(id, {
        deletedBy,
        deletedAt: new Date(),
      });
    } catch (error) {
      throw new BadRequestException('Failed to delete order lens detail');
    }
  }

  async restore(
    id: number,
    restoredBy: number,
  ): Promise<OrderLensDetailResponseDto> {
    const entity = await this.orderLensDetailRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!entity) {
      throw new NotFoundException(`Order lens detail with ID ${id} not found`);
    }

    if (!entity.deletedAt) {
      throw new BadRequestException('Order lens detail is not deleted');
    }

    try {
      await this.orderLensDetailRepository.restore(id);
      await this.orderLensDetailRepository.update(id, {
        deletedBy: undefined,
        updatedBy: restoredBy,
        updatedAt: new Date(),
      });

      const restoredEntity = await this.orderLensDetailRepository.findOne({
        where: { id },
        relations: ['orderItem'],
      });

      return this.mapToResponseDto(restoredEntity!.toModel());
    } catch (error) {
      throw new BadRequestException('Failed to restore order lens detail');
    }
  }

  private mapToResponseDto(
    model: OrderLensDetailModel,
  ): OrderLensDetailResponseDto {
    return {
      id: model.id,
      orderItemId: model.orderItemId,
      lensVariantId: model.lensVariantId,
      rightEyeSphere: model.rightEyeSphere,
      rightEyeCylinder: model.rightEyeCylinder,
      rightEyeAxis: model.rightEyeAxis,
      leftEyeSphere: model.leftEyeSphere,
      leftEyeCylinder: model.leftEyeCylinder,
      leftEyeAxis: model.leftEyeAxis,
      pdLeft: model.pdLeft,
      pdRight: model.pdRight,
      addLeft: model.addLeft,
      addRight: model.addRight,
      lensPrice: model.lensPrice,
      selectedCoatingIds: model.selectedCoatingIds,
      selectedTintColorId: model.selectedTintColorId,
      prescriptionNotes: model.prescriptionNotes,
      lensNotes: model.lensNotes,
      manufacturingNotes: model.manufacturingNotes,
      createdAt: model.createdAt,
      createdBy: model.createdBy,
      updatedAt: model.updatedAt,
      updatedBy: model.updatedBy,
      deletedAt: model.deletedAt,
      deletedBy: model.deletedBy,
    };
  }
}
