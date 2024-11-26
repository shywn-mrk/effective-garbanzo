import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;

  const mockRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create and return a product', async () => {
      const dto = { name: 'Test Product', price: 100 };
      const savedProduct = { id: 1, ...dto, version: 1 };

      mockRepository.save.mockResolvedValue(savedProduct);

      const result = await service.createProduct(dto.name, dto.price);
      expect(result).toEqual(savedProduct);
      expect(mockRepository.save).toHaveBeenCalledWith({ name: dto.name, price: dto.price });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const product = { id: 1, name: 'Test Product', price: 100, version: 1 };
  
      mockRepository.findOneBy.mockResolvedValue(product);
  
      mockRepository.delete.mockResolvedValue({ affected: 1 });
  
      const result = await service.deleteProduct(1);
  
      expect(result).toBeUndefined();
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  
    it('should throw NotFoundException if product does not exist', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);
  
      await expect(service.deleteProduct(1)).rejects.toThrow('Product not found');
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });
});
