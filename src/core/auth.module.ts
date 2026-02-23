import { Module } from '@nestjs/common';
import { authController } from './controllers/auth.controller';
import { DataBaseService } from './database/database.service';
import { AuthService } from './services/auth.service';

@Module({
  imports: [],
  controllers: [authController],
  providers: [DataBaseService, AuthService],
  exports: [],
})
export class AuthModule {}
