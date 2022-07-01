import { BaseAction } from 'src/app/store/base-action';
import { Recipe } from '../recipe.model';

export const ADD_RECIPE = '[Recipes] Add Recipe';
export const SET_RECIPES = '[Recipes] Set Recipes';
export const FETCH_RECIPES = '[Recipes] Fetch Recipes';

export class SetRecipes extends BaseAction<Recipe[]> {
  override readonly type: string = SET_RECIPES;
}

export class FetchRecipes extends BaseAction<null> {
  override readonly type: string = FETCH_RECIPES;
}

export type RecipesActions = SetRecipes;
