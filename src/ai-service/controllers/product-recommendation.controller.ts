import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  ProductRecommendationService,
  AIAnalysisResult,
  ProductRecommendationFilter,
} from '../services/product-recommendation.service';

@ApiTags('Product Recommendation')
@Controller('product-recommendation')
export class ProductRecommendationController {
  constructor(
    private readonly productRecommendationService: ProductRecommendationService,
  ) {}

  @Post('ai-based')
  @ApiOperation({ summary: 'Get product recommendations based on AI analysis' })
  @ApiResponse({
    status: 200,
    description: 'Product recommendations based on AI face analysis',
  })
  async getAIBasedRecommendations(
    @Body() aiAnalysis: AIAnalysisResult,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const recommendations =
        await this.productRecommendationService.getProductRecommendations(
          aiAnalysis,
          page,
          limit,
        );

      return {
        success: true,
        data: recommendations,
        message: 'AI-based product recommendations retrieved successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to get AI-based recommendations',
        error: error.message,
      };
    }
  }

  @Get('filter')
  @ApiOperation({ summary: 'Get product recommendations with custom filters' })
  @ApiResponse({
    status: 200,
    description: 'Filtered product recommendations',
  })
  async getFilteredRecommendations(
    @Query() filters: ProductRecommendationFilter,
  ) {
    try {
      const recommendations =
        await this.productRecommendationService.getFilteredProducts(filters);

      return {
        success: true,
        data: recommendations,
        message: 'Filtered product recommendations retrieved successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Failed to get filtered recommendations',
        error: error.message,
      };
    }
  }

  @Post('test-sample')
  @ApiOperation({ summary: 'Test with sample AI analysis data' })
  @ApiResponse({
    status: 200,
    description: 'Test recommendations with sample data',
  })
  async testWithSampleData() {
    const sampleAIAnalysis: AIAnalysisResult = {
      gender: {
        detected: 'female',
        confidence: 0.5949578881263733,
      },
      SkinColor: {
        detected: 'dark',
        confidence: 0.9,
      },
      faceShape: {
        detected: 'round',
        confidence: 0.9354,
      },
    };

    try {
      const recommendations =
        await this.productRecommendationService.getProductRecommendations(
          sampleAIAnalysis,
          1,
          10,
        );

      return {
        success: true,
        data: {
          inputAnalysis: sampleAIAnalysis,
          recommendations: recommendations,
        },
        message: 'Sample AI analysis test completed successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Sample test failed',
        error: error.message,
      };
    }
  }
}
