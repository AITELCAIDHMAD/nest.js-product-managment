import { RedisService } from '@nestjs-labs/nestjs-redis';
import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { Repository } from 'typeorm';
import { PropertyDTO } from './dto/create-property.dto';
import { PropertyEntity } from './entities/property.entity';
import { Property, PropertyDocument } from './schema/property.schema';
export class PropertyService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
    private readonly redisService: RedisService,
    @InjectRepository(PropertyEntity)
    private propertyRepository: Repository<PropertyEntity>,
  ) {}

  async findAll(): Promise<Property[]> {
    const redis = this.redisService.getClient();

    return this.propertyModel.find().exec();
  }

  async findOne(id: number): Promise<Property | null> {
    return this.propertyModel.findOne({ id }).exec();
  }

  async delete(id: number) {
    const result = await this.propertyModel.deleteOne({ id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`The property with id ${id} is not deleted`);
    }

    return true;
  }
  async update(id: number, property: PropertyDTO) {
    const result = await this.propertyModel
      .findOneAndUpdate({ id }, property, { new: true })
      .exec();

    if (!result) {
      throw new NotFoundException(`The property with id ${id} is not found`);
    }

    return result;
  }

  async create(propertyDTO: PropertyDTO) {
    console.log(propertyDTO);
    const createdProperty = new this.propertyModel(propertyDTO);
    const result = await createdProperty.save();

    // Also create in TypeORM
    const typeormEntity = this.propertyRepository.create(propertyDTO);
    await this.propertyRepository.save(typeormEntity);
  }
}
