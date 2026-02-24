import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const node = configService.get<string>('ELASTIC_SEARCH_NODE');
        const apiKey = configService.get<string>('ELASTIC_SEARCH_API');
        const cloudId = configService.get<string>('ELASTIC_CLOUD_ID');

        if (!node && !cloudId) {
          throw new Error(
            'Either ELASTIC_SEARCH_NODE or ELASTIC_CLOUD_ID must be provided',
          );
        }

        if (!apiKey) {
          throw new Error('ELASTIC_SEARCH_API must be provided');
        }

        // If cloudId is provided, use it; otherwise use node
        if (cloudId) {
          return {
            cloud: {
              id: cloudId,
            },
            auth: {
              apiKey: apiKey,
            },
          };
        }

        return {
          node: node,
          auth: {
            apiKey: apiKey,
          },
        };
      },
    }),
  ],
  exports: [ElasticsearchModule],
})
export class ElasticsearchConfigModule {}
