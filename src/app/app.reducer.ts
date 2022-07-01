import { Action, ActionReducerMap } from '@ngrx/store';
import { ShoppingListActions } from './shopping-list/store/shopping-list.actions';
import * as fromShoppingList from './shopping-list/store/shopping-list.reducer';

export interface AppStore {
  shoppingList: fromShoppingList.ShoppingListStore;
}

export const appReducer: ActionReducerMap<AppStore, ShoppingListActions> = {
  shoppingList: fromShoppingList.shoppingListReducer,
};

export class BaseAction<T> implements Action {
  readonly type: string;
  constructor(public payload?: T) {}
}

