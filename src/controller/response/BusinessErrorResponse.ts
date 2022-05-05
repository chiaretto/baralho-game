import { CustomError } from '../../errors/CustomError';

export class BusinessErrorResponse {
  message: string;
  type: string;
  params: object;

  constructor(type: string, message: string, params: Map<string, string>) {
    this.message = message;
    this.type = type;
    this.params = Object.fromEntries(params.entries());
  }

  public static buildFromCustomError(customError: CustomError) : BusinessErrorResponse {
    return new BusinessErrorResponse(customError.name, customError.message, customError.params);
  }
}