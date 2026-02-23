import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { Repository } from 'typeorm';
import { Product } from '../property/entities/product.schema';
import { ProductEnity } from './entities/product.entity';
import { ProductService } from './product.service';

const mockTypeOrmProduct = {
  id: 1,
  name: 'TypeORM Product',
  description: 'TypeORM Desc',
  categories: [],
};
const mockMongoProduct = {
  id: 1,
  name: 'MongoDB Product',
  description: 'MongoDB Desc',
  categories: [],
};

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: jest.Mocked<Repository<ProductEnity>>;
  let productModel: jest.Mocked<Model<any>>;

  beforeEach(async () => {
    productRepository = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockResolvedValue(mockTypeOrmProduct),
      find: jest.fn().mockResolvedValue([mockTypeOrmProduct]),
      findOne: jest.fn().mockResolvedValue(mockTypeOrmProduct),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      remove: jest.fn().mockResolvedValue(mockTypeOrmProduct),
    } as any;

    // Creating a mock for new Model(...) for MongoDB integration
    // This ensures that calling 'new productModel(...)' returns object with mocked save
    const mockProductModelConstructor: any = jest
      .fn()
      .mockImplementation(() => ({
        ...mockMongoProduct,
        save: jest.fn().mockResolvedValue(mockMongoProduct),
      }));

    productModel = {
      aggregate: jest.fn().mockResolvedValue([mockMongoProduct]),
      findOne: jest.fn().mockResolvedValue(mockMongoProduct),
      findOneAndUpdate: jest.fn().mockResolvedValue(mockMongoProduct),
      findOneAndDelete: jest.fn().mockResolvedValue(mockMongoProduct),
      // Not used, just for type completeness
      constructor: mockProductModelConstructor,
    } as any;

    // This allows 'new productModel()' in service code to hit our mock constructor
    Object.setPrototypeOf(productModel, mockProductModelConstructor);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEnity),
          useValue: productRepository,
        },
        { provide: getModelToken(Product.name), useValue: productModel },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all products from both TypeORM and MongoDB', async () => {
    const res = await service.findAll();
    expect(res.typeorm).toEqual([mockTypeOrmProduct]);
    expect(res.mongodb).toEqual([mockMongoProduct]);
  });

  it('should find one product by id from both TypeORM and MongoDB', async () => {
    const res = await service.findOne(1);
    expect(res.typeorm).toEqual(mockTypeOrmProduct);
    expect(res.mongodb).toEqual(mockMongoProduct);
  });

  it('should update a product in both TypeORM and MongoDB', async () => {
    const updatedDto = { name: 'updated', description: 'desc', categories: [] };
    const updatedTypeOrmProduct = { ...mockTypeOrmProduct, ...updatedDto };
    const updatedMongoProduct = { ...mockMongoProduct, ...updatedDto };

    productRepository.findOne = jest
      .fn()
      .mockResolvedValue(updatedTypeOrmProduct);
    productModel.findOneAndUpdate = jest
      .fn()
      .mockResolvedValue(updatedMongoProduct);

    const res = await service.update(1, updatedDto as any);
    expect(res.typeorm).not.toBeNull();
    expect(res.mongodb).not.toBeNull();
    expect(res.typeorm?.name).toBe('updated');
    expect(res.mongodb?.name).toBe('updated');
  });

  it('should remove a product from both TypeORM and MongoDB', async () => {
    productRepository.findOne = jest.fn().mockResolvedValue(mockTypeOrmProduct);
    productRepository.remove = jest.fn().mockResolvedValue(mockTypeOrmProduct);
    productModel.findOneAndDelete = jest
      .fn()
      .mockResolvedValue(mockMongoProduct);

    const res = await service.remove(1);
    expect(res.typeorm.removed).toBe(true);
    expect(res.mongodb.removed).toBe(true);
  });
});
