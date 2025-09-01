export class ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T | null;
  errors?: any;

  constructor(
    success: boolean,
    message: string,
    data?: T | null,
    errors?: any,
  ) {
    this.success = success;
    this.message = message;
    this.data = data ?? null;
    this.errors = errors ?? null;
  }

  static success<T>(data: T, message = 'OK') {
    return new ApiResponse<T>(true, message, data);
  }

  static error(message = 'Error', errors?: any) {
    return new ApiResponse<null>(false, message, null, errors);
  }
}
