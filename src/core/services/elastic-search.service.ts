// elasticsearch/elasticsearch.service.ts
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class MyElasticsearchService {
  constructor(private readonly esService: ElasticsearchService) {}

  async indexDocument(index: string, id: string, body: any) {
    return this.esService.index({
      index,
      id,
      document: body,
    });
  }

  async search(index: string, query: any) {
    return this.esService.search({
      index,
      query,
    });
  }

  async getDocument(index: string, id: string) {
    return this.esService.get({
      index,
      id,
    });
  }
}
