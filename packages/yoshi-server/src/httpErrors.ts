import { wixBusinessError, HttpStatus } from '@wix/wix-errors';

export class InternalServerError extends wixBusinessError(
  1011,
  HttpStatus.INTERNAL,
) {
  // default error code: -100, default http status: 500.
}
