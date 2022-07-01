import { Ingredient } from 'src/app/shared/ingredient.model';
import { BaseAction } from 'src/app/store/base-action';

export const ADD_INGREDIENT = '[ShoppingList] AddIngredient'; // Official practice to identify action bcs action reaches out to all reducers
export const UPDATE_INGREDIENT = '[ShoppingList] UpdateIngredient';
export const ADD_INGREDIENTS = '[ShoppingList] AddIngredients';
export const DELETE_INGREDIENT = '[ShoppingList] DeleteIngredient';
export const START_EDIT = '[ShoppingList] StartEdit';
export const STOP_EDIT = '[ShoppingList] StopEdit';

export class AddIngredient extends BaseAction<Ingredient> {
  override readonly type: string = ADD_INGREDIENT;
  // constructor(public payload: Ingredient) {}
}

export class AddIngredients extends BaseAction<Ingredient[]> {
  override readonly type: string = ADD_INGREDIENTS;
  // constructor(public payload: Ingredient[]) {}
}

export class UpdateIngredient extends BaseAction<Ingredient> {
  override readonly type: string = UPDATE_INGREDIENT;
}

export class DeleteIngredient extends BaseAction<null> {
  override readonly type: string = DELETE_INGREDIENT;
}

export class StartEdit extends BaseAction<number> {
  override readonly type: string = START_EDIT;
}

export class StopEdit extends BaseAction<null> {
  override readonly type: string = STOP_EDIT;
}

export type ShoppingListActions =
  | AddIngredient
  | AddIngredients
  | UpdateIngredient
  | DeleteIngredient
  | StartEdit
  | StopEdit;
