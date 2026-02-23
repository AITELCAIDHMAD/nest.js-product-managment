import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const mockProductService = {
      create: jest.fn((dto) => ({ typeorm: dto, mongodb: dto })),
      findAll: jest.fn(() => ({
        typeorm: [{ id: 1, name: 'Test', description: 'Desc' }],
        mongodb: [{ id: 1, name: 'Test', description: 'Desc' }],
      })),
      findOne: jest.fn((id) => ({
        typeorm: { id, name: 'Test', description: 'Desc' },
        mongodb: { id, name: 'Test', description: 'Desc' },
      })),
      update: jest.fn((id, dto) => ({
        typeorm: { ...dto, id },
        mongodb: { ...dto, id },
      })),
      remove: jest.fn((id) => ({
        typeorm: { removed: true, id },
        mongodb: { removed: true, id },
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a product', async () => {
    const dto: CreateProductDto = {
      name: 'Product',
      description: 'desc',
      categories: [],
    };
    expect(await controller.create(dto)).toEqual({
      typeorm: dto,
      mongodb: dto,
    });
  });

  it('should find all products', async () => {
    const result = await controller.findAll();
    expect(result.typeorm[0].name).toBe('Test');
    expect(result.mongodb[0].name).toBe('Test');
  });

  it('should find one product by id', async () => {
    const result: any = await controller.findOne('1');
    expect(result.typeorm.id).toBe(1);
    expect(result.mongodb.id).toBe(1);
  });

  it('should update a product', async () => {
    const dto: UpdateProductDto = {
      name: 'Updated',
      description: 'desc',
      categories: [],
    };
    const result: any = await controller.update('1', dto);
    expect(result.typeorm.name).toBe('Updated');
    expect(result.mongodb.name).toBe('Updated');
    expect(result.typeorm.id).toBe(1);
  });

  it('should remove a product', async () => {
    const result = await controller.remove('2');
    expect(result.typeorm.removed).toBe(true);
    expect(result.mongodb.removed).toBe(true);
    expect(result.typeorm.id).toBe(2);
  });
});
