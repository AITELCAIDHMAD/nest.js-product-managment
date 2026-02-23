import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PropertyDocument = HydratedDocument<Property>;

@Schema()
export class Address {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  zipCode: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

@Schema({
  timestamps: true, // adds createdAt & updatedAt
})
export class Property {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, index: true })
  name: string;

  // Array of strings as 'type'
  @Prop({ type: [String], required: true })
  type: string[];

  // Nested object
  @Prop({ type: Object, required: false })
  features: {
    rooms?: number;
    bathrooms?: number;
    [key: string]: any;
  };

  // Reference to Address schema as nested object, set up for population
  @Prop({
    type: 'ObjectId',
    ref: 'Address',
    required: false,
    autopopulate: true,
  })
  address: Address;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
