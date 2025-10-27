import { StatusCodes } from 'http-status-codes'

export class ServiceError extends Error {
  public code: number

  constructor(message: string, code: number) {
    super(message)
    this.message = message
    this.code = code
  }
}

class BadRequestException extends ServiceError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST)
  }
}

class UnauthorizedException extends ServiceError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED)
  }
}

class InternalServerErrorException extends ServiceError {
  constructor(message: string) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR)
  }
}

class ExpectationFailedException extends ServiceError {
  constructor(message: string) {
    super(message, StatusCodes.EXPECTATION_FAILED)
  }
}

export class ConflictException extends ServiceError {
  constructor(message: string) {
    super(message, StatusCodes.CONFLICT)
  }
}

class ServiceUnavailableException extends ServiceError {
  constructor(message: string = 'service is unavailable') {
    super(message, StatusCodes.SERVICE_UNAVAILABLE)
  }
}

class NotFoundException extends ServiceError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND)
  }
}

class ForbiddenRequestException extends ServiceError {
  constructor(message: string) {
    super(message, StatusCodes.FORBIDDEN)
  }
}

class ValidationException extends ServiceError {
  public key: any;

  constructor(message: string, key?: any) {
    super(message, StatusCodes.BAD_REQUEST);
    this.key = key;
  }
}

class ThrottleException extends ServiceError {
  constructor(message: string) {
    super(message, StatusCodes.TOO_MANY_REQUESTS);
  }
}

export {
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
  ExpectationFailedException,
  ServiceUnavailableException,
  NotFoundException,
  ForbiddenRequestException,
  ValidationException,
  ThrottleException
}
