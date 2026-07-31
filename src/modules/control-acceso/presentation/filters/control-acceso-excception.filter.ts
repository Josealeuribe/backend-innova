import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { ControlAccesoError } from '../../errors/control-acceso.errors';

@Catch(ControlAccesoError)
export class ControlAccesoExceptionFilter implements ExceptionFilter {
  catch(exception: ControlAccesoError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    const httpException = (() => {
      switch (exception.code) {
        case 'NOT_FOUND':
          return new NotFoundException(exception.message);
        case 'DUPLICATE':
        case 'ACTIVE_DEPENDENCIES':
          return new ConflictException(exception.message);
        case 'INVALID_RELATION':
        case 'INVALID_PARENT':
          return new BadRequestException(exception.message);
      }
    })();

    const status = httpException.getStatus();
    response.status(status).json(httpException.getResponse());
  }
}
