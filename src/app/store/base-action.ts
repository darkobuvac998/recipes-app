import { Action } from '@ngrx/store';

export class BaseAction<T> implements Action {
  readonly type: string;
  constructor(public payload?: T) {}
}
