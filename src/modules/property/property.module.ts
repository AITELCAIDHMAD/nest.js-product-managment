import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyEntity } from './entities/property.entity';
import { PropertyController } from './property.controller';
import { PropertyService } from './property.service';
import { Property, PropertySchema } from './schema/property.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Property.name, schema: PropertySchema },
    ]),

    TypeOrmModule.forFeature([PropertyEntity]),
  ],
  providers: [PropertyService],
  controllers: [PropertyController], //yes
  exports: [],
})
export class PropertyModule {}
