import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  const categoryServiceMock = {
    create: jest.fn(() => true),
    findAll: jest.fn(() => []),
    findOne: jest.fn(() => true),
    update: jest.fn(() => true),
    remove: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: categoryServiceMock,
        },
      ],
    })

      .compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be defined', async () => {
    const result = await controller.findAll();

    expect(result).toEqual([]);
    expect(service.findAll).toHaveBeenCalledTimes(1);
  });
});
