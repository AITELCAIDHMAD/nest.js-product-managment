import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFloatPipe,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { PropertyDTO } from './dto/create-property.dto';
import { PropertyService } from './property.service';

@Controller({
  path: 'property',
  version: '1',
})
export class PropertyController {
  constructor(private propertyService: PropertyService) {}

  @Get()
  findAll() {
    return this.propertyService.findAll();
  }

  @Post()
  createProperty(@Body() propertyDTO: PropertyDTO) {
    console.log('got', propertyDTO);
    return this.propertyService.create(propertyDTO);
  }

  @Get(':id')
  findOne(@Param('id', ParseFloatPipe) id: number) {
    return this.propertyService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() property: PropertyDTO) {
    return this.propertyService.update(id, property);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.propertyService.delete(id);
  }
}
