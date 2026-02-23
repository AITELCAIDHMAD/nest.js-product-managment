import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataBaseService } from '../database/database.service';
import { AuthDTO } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private databaseService: DataBaseService,
    private jwtService: JwtService,
  ) {}

  async auth(auth: AuthDTO) {
    const user = await this.databaseService.fetchData();

    if (!user) {
      throw new UnauthorizedException('The email or password is not correct');
    }

    const payload = {
      roles: user.roles,
      whatever: 'yes',
    };

    return {
      accessToken: await this.jwtService.sign(payload, {
        expiresIn: '3s',
      }),
    };
  }

  profile() {
    this.databaseService.fetchData();
  }
}
