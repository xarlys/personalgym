export class AppError {
  message: string;
  statusCode?: number = 400;

  constructor(message: string, statusCode?: number) {
    this.message = message;
    this.statusCode = statusCode;
  }
}