import { Controller, Req, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PurchaseService } from '../purchase/purchase.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserPurchasesItemDto } from './user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private readonly purchaseService: PurchaseService,
  ) {}

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get user purchases' })
  @ApiResponse({
    status: 200,
    description: 'The user purchases retrieved successfully.',
    type: [UserPurchasesItemDto],
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @Get('purchases')
  getUserPurchases(@Req() request: any) {
    const { userId } = request.user;
    const { page = 1, limit = 10 } = request.query;
    return this.purchaseService.getUserPurchases(userId, page, limit);
  }
}
