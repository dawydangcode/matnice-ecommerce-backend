import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProductService } from '../product.service';

@Injectable()
export class ProductSchedulerService {
  private readonly logger = new Logger(ProductSchedulerService.name);

  constructor(private readonly productService: ProductService) {}

  /**
   * Chạy mỗi ngày lúc 00:00 để cập nhật các sản phẩm hết hạn "new"
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleExpiredNewProducts() {
    this.logger.log('Starting scheduled task: Update expired new products');

    try {
      const updatedCount = await this.productService.updateExpiredNewProducts();
      this.logger.log(`Successfully updated ${updatedCount} expired products`);

      if (updatedCount > 0) {
        // Log chi tiết các sản phẩm đã được cập nhật
        this.logger.log(
          `${updatedCount} products have been automatically updated from isNew=true to isNew=false`,
        );
      }
    } catch (error) {
      this.logger.error('Error updating expired new products:', error);
    }
  }

  async runExpiredProductsUpdateNow(): Promise<{
    updatedCount: number;
  }> {
    this.logger.log('Manual run: Update expired new products');

    const updatedCount = await this.productService.updateExpiredNewProducts();

    return {
      updatedCount,
    };
  }
}
