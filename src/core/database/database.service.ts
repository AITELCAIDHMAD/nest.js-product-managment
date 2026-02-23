import { Injectable } from '@nestjs/common';

@Injectable()
export class DataBaseService {
  async fetchData() {
    return {
      email: 'test@gmail.com',
      roles: ['admin'],
      permissions: ['read', 'write'],
    };
  }
}
