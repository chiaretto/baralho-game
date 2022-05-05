export class CustomError extends Error {
  params: Map<string, string>;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.params = new Map<string, string>();
  }

  protected addParam(key: string, value: string) {
    this.params.set(key, value);
  }
}