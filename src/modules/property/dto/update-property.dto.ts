import { PartialType } from '@nestjs/mapped-types';
import { PropertyDTO } from './create-property.dto';

export class EditPropertyDTO extends PartialType(PropertyDTO) {}
