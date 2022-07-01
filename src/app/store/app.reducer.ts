import { Action, ActionReducerMap } from '@ngrx/store';

import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromRecipes from '../recipes/store/recipes.reducer';

export interface AppStore {
  shoppingList: fromShoppingList.ShoppingListStore;
  auth: fromAuth.AuthStore; // substates
  recipes: fromRecipes.RecipesStore;
}

export const appReducer: ActionReducerMap<AppStore> = {
  shoppingList: fromShoppingList.shoppingListReducer,
  auth: fromAuth.authReducer,
  recipes: fromRecipes.recipeReducer,
};
