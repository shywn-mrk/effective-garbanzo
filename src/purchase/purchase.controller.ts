import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CreatePurchaseDto, PurchaseResponseDto } from './purchase.dto';


@ApiTags("Purchases")
@ApiBearerAuth()
@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new purchase' })
  @ApiBody({ type: CreatePurchaseDto })
  @ApiResponse({
    status: 201,
    description: 'The created purchase object.',
    type: PurchaseResponseDto,
  })
  createPurchase(
    @Req() request: any,
    @Body() body: { productId: number, quantity: number },
  ) {
    return this.purchaseService.createPurchase(request.user.userId, body.productId, body.quantity);
  }
}
