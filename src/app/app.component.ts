import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from './auth/auth.service';
import { LoggingService } from './logging.service';
import { AppStore } from './store/app.reducer';

import * as AuthActions from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'recipes-app';
  loadedFiture: string = 'recipe';

  constructor(
    private authService: AuthService,
    private loggingService: LoggingService,
    private store: Store<AppStore>
  ) {}

  ngOnInit(): void {
    // this.authService.autoLogin();
    // this.loggingService.printLog('Hello from AppComponent ngOnInit');
    this.store.dispatch(new AuthActions.AutoLogin());
  }
}
