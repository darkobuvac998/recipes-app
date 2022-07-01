import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import { AppStore } from '../store/app.reducer';

import * as AuthActions from './store/auth.actions';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  kind: string;
  registered?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(
  //   null
  // );

  private _tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<AppStore>
  ) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.API_KEY}`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this._handleError),
        tap((response) => {
          this._handleAuthentication(
            response.email,
            response.localId,
            response.idToken,
            +response.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.API_KEY}`,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this._handleError),
        tap((response) => {
          this._handleAuthentication(
            response.email,
            response.localId,
            response.idToken,
            +response.expiresIn
          );
        })
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData') ?? '{}');
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (!loadedUser.token) {
      return;
    }

    const expirationDuration =
      new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();

    // this.userSubject.next(loadedUser);
    this.store.dispatch(
      new AuthActions.AuthenticateSuccess({
        email: loadedUser.email as string,
        userId: loadedUser.id as string,
        token: loadedUser.token,
        expirationDate: new Date(userData._tokenExpirationDate),
        redirect: true,
      })
    );

    this.setLogoutTimer(expirationDuration);
  }

  logout() {
    // this.userSubject.next(null);
    this.store.dispatch(new AuthActions.Logout());
    // this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this._tokenExpirationTimer) {
      clearTimeout(this._tokenExpirationTimer);
    }
    this._tokenExpirationTimer = null;
  }

  setLogoutTimer(expirationDuration: number) {
    console.log(expirationDuration);
    this._tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  private _handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.store.dispatch(
      new AuthActions.AuthenticateSuccess({
        email: email,
        userId: userId,
        token: token,
        expirationDate: expirationDate,
        redirect: true,
      })
    );
    // this.userSubject.next(user);
    this.setLogoutTimer(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  clearLogoutTimer() {
    if (this._tokenExpirationTimer) {
      clearTimeout(this._tokenExpirationTimer);
      this._tokenExpirationTimer = null;
    }
  }

  private _handleError(erroRes: HttpErrorResponse) {
    let errMsg = 'An unknown error occurred!';
    if (!erroRes.error || !erroRes.error.error) {
      return throwError(errMsg);
    }
    switch (erroRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errMsg = 'This email exists already!';
        break;
      case 'EMAIL_NOT_FOUND':
        errMsg = 'This email does not exists.';
        break;
      case 'INVALID_PASSWORD':
        errMsg = 'Password is invalid!';
    }
    return throwError(errMsg);
  }
}
