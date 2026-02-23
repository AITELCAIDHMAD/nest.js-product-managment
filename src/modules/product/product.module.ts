import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElasticsearchConfigModule } from 'src/core/elasticsearch/elasticsearch-config.module';
import { MyElasticsearchService } from 'src/core/services/elastic-search.service';
import { Product, ProductSchema } from '../property/entities/product.schema';
import { ProductEnity } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEnity]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    ElasticsearchConfigModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, MyElasticsearchService],
  exports: [],
})
export class ProductModule {} //yes
