import { RedisModule } from '@nestjs-labs/nestjs-redis';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './core/auth.module';
import { ElasticsearchConfigModule } from './core/elasticsearch/elasticsearch-config.module';
import { LoggerMiddleware } from './core/middlewares/logger.middleware';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { PropertyModule } from './modules/property/property.module';
@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        API_KEY: Joi.string().required(),
        PORT: Joi.number().default(3333),
        JWT_SECRET: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
        ELASTIC_SEARCH_NODE: Joi.string().required(),
        ELASTIC_SEARCH_API: Joi.string().required(),
      }),
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }
        return {
          secret,
          signOptions: { expiresIn: '60s' },
        };
      },
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log('hello', configService.get<string>('MONGODB_URI'));
        return { uri: configService.get<string>('MONGODB_URI') };
      },
    }),

    ElasticsearchConfigModule,

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: '', // your PostgreSQL username
      password: '', // fill in if you set one
      database: 'testdb', // create this database beforehand
      synchronize: true, // ⚠️ only for development /
      autoLoadEntities: true, // allow from modules forFeature
    }),
    RedisModule.forRoot({
      url: 'redis://localhost:6379',
    }),
    PropertyModule,
    AuthModule,
    ProductModule,
    ProductModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); // applies to all routes
  }
}
