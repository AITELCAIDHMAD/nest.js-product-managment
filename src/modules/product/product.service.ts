import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { MyElasticsearchService } from 'src/core/services/elastic-search.service';
import { Repository } from 'typeorm';
import { Product, ProductDocument } from '../property/entities/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEnity } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEnity)
    private readonly productRepository: Repository<ProductEnity>,

    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,

    private elasticsearchService: MyElasticsearchService,
  ) {}

  // Create product in both TypeORM and MongoDB
  async create(createProductDto: CreateProductDto) {
    // Create product for TypeORM
    const newProduct = this.productRepository.create(createProductDto);
    const savedTypeOrmProduct = await this.productRepository.save(newProduct);

    // Create product for MongoDB
    const mongoProduct = new this.productModel(createProductDto);
    const savedMongoProduct = await mongoProduct.save();

    // index the product

    this.elasticsearchService.indexDocument(
      'products',
      createProductDto.id + '',
      createProductDto,
    );

    return {
      typeorm: savedTypeOrmProduct,
      mongodb: savedMongoProduct,
    };
  }

  // Find all products from both TypeORM and MongoDB
  async findAll() {
    // Fetch all from MongoDB with aggregation
    const mongoProducts = await this.productModel.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      { $match: {} },
      { $sort: { name: 1 } },
      {
        $group: {
          _id: '$name',
          total: { $sum: 1 },
          docs: { $push: '$$ROOT' },
          joined: { $push: '$categoryDetails' },
        },
      },
      { $limit: 10 },
    ]);

    // Fetch all from TypeORM
    const typeOrmProducts = await this.productRepository.find();

    return {
      mongodb: mongoProducts,
      typeorm: typeOrmProducts,
    };
  }

  // Find one product by ID from both TypeORM and MongoDB
  async findOne(id: number) {
    const typeOrmProduct = await this.productRepository.findOne({
      where: { id },
    });
    const mongoProduct = await this.productModel.findOne({ id });
    return {
      typeorm: typeOrmProduct,
      mongodb: mongoProduct,
    };
  }

  // Update product in both TypeORM and MongoDB
  async update(id: number, updateProductDto: UpdateProductDto) {
    // TypeORM update
    await this.productRepository.update({ id }, updateProductDto);
    const updatedTypeOrmProduct = await this.productRepository.findOne({
      where: { id },
    });

    // MongoDB update
    const updatedMongoProduct = await this.productModel.findOneAndUpdate(
      { id },
      updateProductDto,
      { new: true },
    );

    return {
      typeorm: updatedTypeOrmProduct,
      mongodb: updatedMongoProduct,
    };
  }

  // Remove product from both TypeORM and MongoDB
  async remove(id: number) {
    // TypeORM remove
    const typeOrmProduct = await this.productRepository.findOne({
      where: { id },
    });
    if (typeOrmProduct) {
      await this.productRepository.remove(typeOrmProduct);
    }

    const mongoProduct = await this.productModel.findOneAndDelete({ id });

    return {
      typeorm: typeOrmProduct ? { removed: true, id } : { removed: false, id },
      mongodb: mongoProduct ? { removed: true, id } : { removed: false, id },
    };
  }
}
