import { Subject } from 'rxjs';

export class User {
  constructor(
    public email?: string,
    public id?: string,
    private _token?: string,
    private _tokenExpirationDate?: Date
  ) {}

  get token() {
    // getter speical type of property
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}
