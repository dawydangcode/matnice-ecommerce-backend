import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/role/decorators/roles.decorator';
import { RoleType } from 'src/role/enum/role.enum';
import { Public } from 'src/middlewares/guards/jwt-auth.guard';

@ApiTags('Test Permissions')
@Controller('api/v1/test-permissions')
export class TestPermissionsController {
  // 1. GUEST - Không cần đăng nhập (Public)
  @Public()
  @Get('guest/products')
  async getPublicProducts() {
    return {
      message: 'This endpoint is accessible by GUEST (not authenticated)',
      data: ['Product 1', 'Product 2', 'Product 3'],
      access: 'GUEST',
    };
  }

  @Public()
  @Get('guest/categories')
  async getPublicCategories() {
    return {
      message: 'This endpoint is accessible by GUEST (not authenticated)',
      data: ['Category 1', 'Category 2', 'Category 3'],
      access: 'GUEST',
    };
  }

  // 2. USER - Chỉ user đã đăng nhập
  @Roles(RoleType.User)
  @Get('user/profile')
  async getUserProfile() {
    return {
      message: 'This endpoint is accessible by USER only',
      data: { name: 'User Profile', role: 'user' },
      access: 'USER_ONLY',
    };
  }

  @Roles(RoleType.User)
  @Post('user/cart')
  async addToCart() {
    return {
      message: 'This endpoint is accessible by USER only',
      data: 'Item added to cart',
      access: 'USER_ONLY',
    };
  }

  // 3. USER + ADMIN + EMPLOYEE - Người dùng đã đăng nhập (bất kỳ role nào)
  @Roles(RoleType.User, RoleType.Admin, RoleType.Employee)
  @Get('authenticated/orders')
  async getMyOrders() {
    return {
      message: 'This endpoint is accessible by any AUTHENTICATED user',
      data: ['Order 1', 'Order 2'],
      access: 'AUTHENTICATED_USERS',
    };
  }

  @Roles(RoleType.User, RoleType.Admin, RoleType.Employee)
  @Put('authenticated/profile')
  async updateProfile() {
    return {
      message: 'This endpoint is accessible by any AUTHENTICATED user',
      data: 'Profile updated',
      access: 'AUTHENTICATED_USERS',
    };
  }

  // 4. ADMIN ONLY - Chỉ admin
  @Roles(RoleType.Admin)
  @Post('admin/products')
  async createProduct() {
    return {
      message: 'This endpoint is accessible by ADMIN only',
      data: 'Product created',
      access: 'ADMIN_ONLY',
    };
  }

  @Roles(RoleType.Admin)
  @Delete('admin/products/:id')
  async deleteProduct() {
    return {
      message: 'This endpoint is accessible by ADMIN only',
      data: 'Product deleted',
      access: 'ADMIN_ONLY',
    };
  }

  // 5. ADMIN + EMPLOYEE - Nhân viên và admin
  @Roles(RoleType.Admin, RoleType.Employee)
  @Get('staff/reports')
  async getReports() {
    return {
      message: 'This endpoint is accessible by ADMIN and EMPLOYEE',
      data: ['Report 1', 'Report 2'],
      access: 'STAFF_ONLY',
    };
  }

  @Roles(RoleType.Admin, RoleType.Employee)
  @Put('staff/inventory')
  async updateInventory() {
    return {
      message: 'This endpoint is accessible by ADMIN and EMPLOYEE',
      data: 'Inventory updated',
      access: 'STAFF_ONLY',
    };
  }

  // 6. ALL ROLES - Tất cả các role
  @Roles(RoleType.Admin, RoleType.Employee, RoleType.User, RoleType.Guest)
  @Get('public/announcements')
  async getAnnouncements() {
    return {
      message: 'This endpoint is accessible by ALL ROLES',
      data: ['Announcement 1', 'Announcement 2'],
      access: 'ALL_ROLES',
    };
  }
}
