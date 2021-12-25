interface errorObjectType {
  status: number
  message: string
}

export default class ServiceError extends Error {
  public status;

  public message;

  constructor(errorObject: errorObjectType) {
    super(errorObject.message);
    this.status = errorObject.status;
    this.message = errorObject.message;
  }
}
