import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './modules/order/order.module';
import { PropertyModule } from './modules/property/property.module';
import { UserModule } from './modules/user/user.module';
import { TestModule } from './modules/test/test.module';
import { Test2Module } from './modules/test2/test2.module';
import { Test3Module } from './modules/test3/test3.module';

@Module({
  imports: [OrderModule, PropertyModule, UserModule, TestModule, Test2Module, Test3Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
