class AppError extends Error {
  errorCode: ErrorCodes;

  constructor(errorCode: ErrorCodes, message: string) {
    super(message);
    this.errorCode = errorCode;
  }
}

export class AuthError extends AppError {
  constructor(errorCode: ErrorCodes, message: string) {
    super(errorCode, message);
  }
}

export class RateExceededError extends AppError {
  constructor(errorCode: ErrorCodes, message: string) {
    super(errorCode, message);
  }
}

export enum ErrorCodes {
  USER_ALREADY_EXISTS = 1001,
  USER_NOT_FOUND = 1002,
  VALIDATION_ERROR = 1003,
  INVALID_CREDENTIALS = 1004,
  RATE_LIMIT_EXCEEDED = 1005,
}
