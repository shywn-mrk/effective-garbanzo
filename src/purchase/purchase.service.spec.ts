import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseService } from './purchase.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Purchase } from './purchase.entity';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';

describe('PurchaseService', () => {
  let service: PurchaseService;

  const mockPurchaseRepository = {
    save: jest.fn(),
    create: jest.fn(),
    findAndCount: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockProductRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseService,
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
    }).compile();

    service = module.get<PurchaseService>(PurchaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPurchase', () => {
    it('should create a purchase and return it', async () => {
      const userId = 1;
      const productId = 2;
      const quantity = 3;

      const mockUser = { id: userId };
      const mockProduct = { id: productId, price: 100 };
      const mockPurchase = { user: mockUser, product: mockProduct, quantity, priceAtPurchaseTime: 100 };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockProductRepository.findOne.mockResolvedValue(mockProduct);
      mockPurchaseRepository.create.mockReturnValue(mockPurchase);
      mockPurchaseRepository.save.mockResolvedValue(mockPurchase);

      const result = await service.createPurchase(userId, productId, quantity);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { id: productId } });
      expect(mockPurchaseRepository.create).toHaveBeenCalledWith({
        user: mockUser,
        product: mockProduct,
        quantity,
        priceAtPurchaseTime: 100,
      });
      expect(mockPurchaseRepository.save).toHaveBeenCalledWith(mockPurchase);
      expect(result).toEqual(mockPurchase);
    });

    it('should throw an error if user or product not found', async () => {
      const userId = 1;
      const productId = 2;
      const quantity = 3;

      mockUserRepository.findOne.mockResolvedValue(null);
      mockProductRepository.findOne.mockResolvedValue({ id: productId, price: 100 });

      await expect(service.createPurchase(userId, productId, quantity)).rejects.toThrow('User or Product not found');
    });
  });

  describe('getUserPurchases', () => {
    it('should return user purchases', async () => {
      const userId = 1;
      const page = 1;
      const limit = 10;
      const mockPurchases = [{ id: 1, user: { id: userId }, product: { id: 2 }, quantity: 3 }];
      const mockTotal = 1;

      mockPurchaseRepository.findAndCount.mockResolvedValue([mockPurchases, mockTotal]);

      const result = await service.getUserPurchases(userId, page, limit);

      expect(mockPurchaseRepository.findAndCount).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['product'],
        order: { purchasedAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });
      expect(result).toEqual(mockPurchases);
    });

    it('should return an empty array if no purchases found', async () => {
      const userId = 1;
      const page = 1;
      const limit = 10;

      mockPurchaseRepository.findAndCount.mockResolvedValue([[], 0]);

      const result = await service.getUserPurchases(userId, page, limit);

      expect(mockPurchaseRepository.findAndCount).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['product'],
        order: { purchasedAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });
      expect(result).toEqual([]);
    });
  });
});
