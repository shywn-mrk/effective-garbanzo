import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthGuard } from '../auth/auth.guard';
import { Purchase } from './purchase.entity';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';

describe('PurchaseController', () => {
  let controller: PurchaseController;
  let purchaseService: PurchaseService;

  const mockPurchaseRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockProductRepository = {
    findOne: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockPurchaseService = {
    createPurchase: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseController],
      providers: [
        {
          provide: PurchaseService,
          useValue: mockPurchaseService,
        },
        {
          provide: getRepositoryToken(Purchase),
          useValue: mockPurchaseRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<PurchaseController>(PurchaseController);
    purchaseService = module.get<PurchaseService>(PurchaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPurchase', () => {
    it('should call purchaseService.createPurchase and return the result', async () => {
      const userId = 1;
      const productId = 42;
      const quantity = 2;
      const mockRequest = { user: { userId } };
      const mockBody = { productId, quantity };

      const mockPurchaseResponse = { id: 1, productId, quantity, userId, createdAt: new Date() };
      mockPurchaseService.createPurchase.mockResolvedValue(mockPurchaseResponse);

      const result = await controller.createPurchase(mockRequest, mockBody);

      expect(purchaseService.createPurchase).toHaveBeenCalledWith(userId, productId, quantity);
      expect(result).toEqual(mockPurchaseResponse);
    });

    it('should throw an error if purchaseService.createPurchase fails', async () => {
      const userId = 1;
      const productId = 42;
      const quantity = 2;
      const mockRequest = { user: { userId } };
      const mockBody = { productId, quantity };

      mockPurchaseService.createPurchase.mockRejectedValue(new Error('Service error'));

      await expect(controller.createPurchase(mockRequest, mockBody)).rejects.toThrow('Service error');
      expect(purchaseService.createPurchase).toHaveBeenCalledWith(userId, productId, quantity);
    });
  });
});
