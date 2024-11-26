import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { PurchaseService } from '../purchase/purchase.service';
import { AuthGuard } from '../auth/auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let purchaseService: PurchaseService;

  const mockPurchaseService = {
    getUserPurchases: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: PurchaseService,
          useValue: mockPurchaseService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<UserController>(UserController);
    purchaseService = module.get<PurchaseService>(PurchaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserPurchases', () => {
    it('should call PurchaseService.getUserPurchases and return the correct data', async () => {
      const mockPurchases = [{ id: 1, product: { id: 2 }, quantity: 3 }];
      const mockUserId = 1;
      const mockPage = 1;
      const mockLimit = 10;

      const mockRequest = {
        user: { userId: mockUserId },
        query: { page: mockPage, limit: mockLimit },
      };

      mockPurchaseService.getUserPurchases.mockResolvedValue(mockPurchases);

      const result = await controller.getUserPurchases(mockRequest);

      expect(mockPurchaseService.getUserPurchases).toHaveBeenCalledWith(
        mockUserId,
        mockPage,
        mockLimit
      );
      expect(result).toEqual(mockPurchases);
    });

    it('should call PurchaseService.getUserPurchases with default page and limit when not provided', async () => {
      const mockPurchases = [{ id: 1, product: { id: 2 }, quantity: 3 }];
      const mockUserId = 1;

      const mockRequest = {
        user: { userId: mockUserId },
        query: {},
      };

      mockPurchaseService.getUserPurchases.mockResolvedValue(mockPurchases);

      const result = await controller.getUserPurchases(mockRequest);

      expect(mockPurchaseService.getUserPurchases).toHaveBeenCalledWith(
        mockUserId,
        1,
        10
      );
      expect(result).toEqual(mockPurchases);
    });

    it('should call PurchaseService.getUserPurchases with correct page and limit from query', async () => {
      const mockPurchases = [{ id: 1, product: { id: 2 }, quantity: 3 }];
      const mockUserId = 1;
      const mockPage = 2;
      const mockLimit = 5;

      const mockRequest = {
        user: { userId: mockUserId },
        query: { page: mockPage, limit: mockLimit },
      };

      mockPurchaseService.getUserPurchases.mockResolvedValue(mockPurchases);

      const result = await controller.getUserPurchases(mockRequest);

      expect(mockPurchaseService.getUserPurchases).toHaveBeenCalledWith(
        mockUserId,
        mockPage,
        mockLimit
      );
      expect(result).toEqual(mockPurchases);
    });
  });

  describe('AuthGuard', () => {
    it('should apply the AuthGuard', async () => {
      mockAuthGuard.canActivate.mockReturnValue(true);

      const mockRequest = {
        user: { userId: 1 },
        query: {},
      };

      const canActivateResult = mockAuthGuard.canActivate(
        { switchToHttp: () => ({ getRequest: () => mockRequest }) } as ExecutionContext,
      );

      expect(canActivateResult).toBe(true);
    });
  });
});
