export type ErrorCode =
  | 'AUTH_REQUIRED'
  | 'INVALID_TOKEN'
  | 'USER_NOT_FOUND'
  | 'STAFF_NOT_FOUND'
  | 'STAFF_EXISTS'
  | 'ACCOUNT_INACTIVE'
  | 'HOSPITAL_NOT_FOUND'
  | 'RESOURCE_NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'BAD_REQUEST'
  | 'FORBIDDEN'
  | 'INVENTORY_NOT_FOUND'
  | 'AGENT_FAILED'
  | 'X402_CONFIGURATION_REQUIRED'
  | 'ALGOD_UNAVAILABLE'
  | 'INDEXER_UNAVAILABLE'
  | 'INVALID_PAYMENT'
  | 'PAYMENT_REQUIRED'
  | 'PAYMENT_EXPIRED'
  | 'PAYMENT_FAILED'
  | 'PAYMENT_ALREADY_USED'
  | 'INVALID_NETWORK'
  | 'INVALID_RECEIVER'
  | 'INVALID_ASSET'
  | 'INSUFFICIENT_AMOUNT'
  | 'TRANSACTION_NOT_FOUND'
  | 'TRANSACTION_NOT_CONFIRMED'
  | 'PAYMENT_NOT_CONFIGURED'
  | 'PAYMENT_CONFIGURATION_REQUIRED'
  | 'ALGORAND_NOT_CONFIGURED'
  | 'RECOMMENDATION_NOT_FOUND'
  | 'PROCUREMENT_NOT_FOUND'
  | 'PROCUREMENT_NOT_APPROVABLE'
  | 'INTERNAL_ERROR';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode: number = 500,
    code: ErrorCode = 'INTERNAL_ERROR',
    details?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
