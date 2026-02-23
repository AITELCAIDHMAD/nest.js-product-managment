import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthDTO } from '../dto/auth.dto';
import { AuthGuard } from '../guards/auth.guard';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class authController {
  constructor(private authService: AuthService) {}

  @Post()
  auth(@Body() authDto: AuthDTO) {
    return this.authService.auth(authDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getUser() {
    return this.authService.profile();
  }
}
