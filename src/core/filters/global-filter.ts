import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(Error)
export class CatchAllError implements ExceptionFilter {
  catch(exception: Error | HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      ((exception as HttpException) &&
        (exception as HttpException).getStatus &&
        (exception as HttpException)?.getStatus()) ||
      400;
    const message = exception.message;

    response.status(status).send({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      yes: 'yes',
      message: message,
    });
  }
}
