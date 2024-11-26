import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  const mockProductService = {
    createProduct: jest.fn(),
    purchaseProduct: jest.fn(),
    getProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  const mockJwtService = {
    verify: jest.fn(),
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .overrideProvider(JwtService)
      .useValue(mockJwtService)
      .compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  describe('createProduct', () => {
    it('should create and return a new product', async () => {
      const dto = { name: 'Test Product', price: 100 };
      const createdProduct: Product = { id: 1, name: 'Test Product', price: 100, version: 1, purchases: [] };

      mockProductService.createProduct.mockResolvedValue(createdProduct);

      const result = await productController.createProduct(dto);

      expect(result).toEqual(createdProduct);
      expect(mockProductService.createProduct).toHaveBeenCalledWith(dto.name, dto.price);
    });

    describe('getProduct', () => {
      it('should return the product by ID', async () => {
        const product: Product = { id: 1, name: 'Test Product', price: 100, version: 1, purchases: [] };

        mockProductService.getProduct.mockResolvedValue(product);

        const result = await productController.getProduct(1);
        expect(result).toEqual(product);
        expect(mockProductService.getProduct).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete the product by ID', async () => {
      mockProductService.deleteProduct.mockResolvedValue(undefined);

      const result = await productController.deleteProduct(1);
      expect(result).toBeUndefined();
      expect(mockProductService.deleteProduct).toHaveBeenCalledWith(1);
    });
  });
});
