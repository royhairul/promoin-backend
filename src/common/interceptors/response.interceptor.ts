import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '@/common/dto/api.response';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const handler = context.getHandler().name; // misalnya createLink, getLinks

    return next.handle().pipe(
      map((data) => {
        if (data instanceof ApiResponse) {
          return data;
        }

        // Buat default message berdasarkan nama handler
        let message = 'OK';
        if (handler.includes('create')) message = 'created successfully';
        else if (handler.includes('update')) message = 'updated successfully';
        else if (handler.includes('delete')) message = 'deleted successfully';
        else if (handler.includes('get')) message = 'fetched successfully';

        return ApiResponse.success(data, message);
      }),
    );
  }
}
