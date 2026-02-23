import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { Repository } from 'typeorm';
import { Product, ProductDocument } from '../property/entities/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEnity } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEnity)
    private productRepository: Repository<ProductEnity>,

    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}
  create(createProductDto: CreateProductDto) {
    console.log('de', createProductDto);
    const newProduct = this.productRepository.create(createProductDto);

    //add mongodb

    const model = new this.productModel(createProductDto);
    model.save();

    return this.productRepository.save(newProduct);
  }

  findAll() {
    // Example: all possible aggregate options
    return this.productModel.aggregate([
      // Lookup stage: join with another collection/table (example: "otherCollection")
      {
        $lookup: {
          from: 'otherCollection', // Replace with the actual collection name you want to join with
          localField: 'name', // Local field in product documents
          foreignField: 'name', // Field in the other collection to match
          as: 'joinedData',
        },
      },

      // Match stage (filter)
      { $match: {} }, // Empty object matches all documents

      // Sort stage
      { $sort: { name: 1 } }, // 1 = ascending, -1 = descending

      // Group stage
      {
        $group: {
          _id: '$name',
          total: { $sum: 1 }, // Count number of products by name
          docs: { $push: '$$ROOT' },
          joined: { $push: '$joinedData' },
        },
      },

      // Limit stage
      { $limit: 10 },
    ]);
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
