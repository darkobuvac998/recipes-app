import { Action } from '@ngrx/store';
import { BaseAction } from 'src/app/store/base-action';

export const LOGOUT = '[Auth] Logout';
export const AUTHENTICATE_SUCCESS = '[Auth] Authenticate Success';
export const AUTHENTICATE_FAIL = '[Auth] Authenticate Fail';
export const SIGNUP_START = '[Auth] Sigunup Start';
export const SIGNUP = '[Auth] Sigunup';
export const LOGIN_START = '[Auth] Login Start';
export const CLEAR_ERROR = '[Auth] Clear Error';
export const AUTO_LOGIN = '[Auth] Auto Login';

export class AuthenticateSuccess extends BaseAction<{
  email: string;
  userId: string;
  token: string;
  expirationDate: Date;
  redirect: boolean
}> {
  override type: string = AUTHENTICATE_SUCCESS;
}

export class Logout extends BaseAction<null> {
  override type: string = LOGOUT;
}

export class LoginStart extends BaseAction<{
  email: string;
  password: string;
}> {
  override type: string = LOGIN_START;
}

export class AuthenticateFail extends BaseAction<string> {
  override type: string = AUTHENTICATE_FAIL;
}

export class SignUpStart extends BaseAction<{
  email: string;
  password: string;
}> {
  override type: string = SIGNUP_START;
}

export class ClearError extends BaseAction<null> {
  override readonly type: string = CLEAR_ERROR;
}

export class AutoLogin extends BaseAction<null> {
  override readonly type: string = AUTO_LOGIN;
}

export type AuthActions =
  | AuthenticateSuccess
  | Logout
  | LoginStart
  | AuthenticateFail
  | ClearError
  | AutoLogin;
