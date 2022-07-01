import { Recipe } from '../recipe.model';
import { RecipesActions } from './recipes.actions';

import * as fromRecipesActions from './recipes.actions';

export interface RecipesStore {
  recipes: Recipe[];
}

const initialState: RecipesStore = {
  recipes: [],
};

export function recipeReducer(
  state = initialState,
  action: RecipesActions
): RecipesStore {
  let payload: any = action.payload;
  switch (action.type) {
    case fromRecipesActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...payload],
      };
    default:
      return state;
  }
}
