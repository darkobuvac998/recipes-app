import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthResponseData, AuthService } from '../auth.service';
import { User } from '../user.model';

import * as AuthActions from './auth.actions';

const handleAuthentication = (
  expiredIn: number,
  email: string,
  userId: string,
  token: string
) => {
  const expirationDate = new Date(new Date().getTime() + expiredIn * 1000);

  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));

  return new AuthActions.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate,
    redirect: true,
  });
};
const handleError = (eroorRes: any) => {
  let errMsg = 'An unknown error occurred!';
  if (!eroorRes.error || !eroorRes.error.error) {
    return of(new AuthActions.AuthenticateFail(errMsg));
  }
  switch (eroorRes.error.error.message) {
    case 'EMAIL_EXISTS':
      errMsg = 'This email exists already!';
      break;
    case 'EMAIL_NOT_FOUND':
      errMsg = 'This email does not exists.';
      break;
    case 'INVALID_PASSWORD':
      errMsg = 'Password is invalid!';
  }

  return of(new AuthActions.AuthenticateFail(errMsg));
};

@Injectable()
export class AuthEffects {
  authSignup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signupAction: AuthActions.SignUpStart) => {
        return this.http
          .post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.API_KEY}`,
            {
              email: signupAction.payload?.email,
              password: signupAction.payload?.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap((resData) => {
              this.authService.setLogoutTimer(+resData.expiresIn * 1000);
            }),
            map((resData) => {
              return handleAuthentication(
                +resData.expiresIn,
                resData.email,
                resData.localId,
                resData.idToken
              );
            }),
            catchError((erroRes) => {
              return handleError(erroRes);
            })
          );
      })
    );
  });

  authLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http
          .post<AuthResponseData>(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.API_KEY}`,
            {
              email: authData.payload?.email,
              password: authData.payload?.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            tap((resData) => {
              this.authService.setLogoutTimer(+resData.expiresIn * 1000);
            }),
            map((resData) => {
              return handleAuthentication(
                +resData.expiresIn,
                resData.email,
                resData.localId,
                resData.idToken
              );
            }),
            catchError((erroRes) => {
              return handleError(erroRes);
            })
          );
      })
    );
  });

  authRedirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authAction: AuthActions.AuthenticateSuccess) => {
          if (authAction.payload?.redirect) this.router.navigate(['/']);
        })
      );
    },
    { dispatch: false }
  );

  authLogout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
          localStorage.removeItem('userData');
          this.authService.clearLogoutTimer();
          this.router.navigate(['/auth']);
        })
      );
    },
    { dispatch: false }
  );

  autoLogin$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map((data: AuthActions.AutoLogin) => {
          const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
          } = JSON.parse(localStorage.getItem('userData') ?? '{}');
          if (!userData) {
            return new AuthActions.Logout();
          }

          const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
          );

          if (!loadedUser.token) {
            return new AuthActions.Logout();
          }

          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();

          this.authService.setLogoutTimer(expirationDuration);
          return new AuthActions.AuthenticateSuccess({
            email: loadedUser.email as string,
            userId: loadedUser.id as string,
            token: loadedUser.token as string,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false,
          });
        })
      );
    },
    { dispatch: true }
  );

  // stream of dispatched actions
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
