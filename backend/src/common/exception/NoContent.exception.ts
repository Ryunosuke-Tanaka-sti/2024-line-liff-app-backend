import { HttpException, HttpStatus } from '@nestjs/common';

export class NoContentException extends HttpException {
  constructor() {
    super('No Content', HttpStatus.NO_CONTENT);
  }
}

export class UnauthorizedException extends HttpException {
  constructor() {
    super('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}
