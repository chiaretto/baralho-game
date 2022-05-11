export class CustomError extends Error {
  params: Map<string, string>;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.params = new Map<string, string>();
  }

  protected addParam(key: string, value: string | number | undefined) {
    if (value)
      this.params.set(key, value.toString());
  }
}