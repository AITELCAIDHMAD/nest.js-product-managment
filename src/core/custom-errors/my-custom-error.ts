import { HttpException, HttpStatus } from '@nestjs/common';

export class MyCustomError extends HttpException {
  constructor(errorMessage: string) {
    super(errorMessage ?? 'Custom Error', HttpStatus.FORBIDDEN);
  }
}
