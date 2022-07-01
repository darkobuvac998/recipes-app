import { Action } from '@ngrx/store';
import { BaseAction } from 'src/app/app.reducer';
import { Ingredient } from 'src/app/shared/ingredient.model';

export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT';
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
export const DELETE_INGREDIENT = 'DELETE_INGREDIENT';
export const START_EDIT = 'START_EDIT';
export const STOP_EDIT = 'STOP_EDIT';

export class AddIngredient implements Action {
  readonly type: string = ADD_INGREDIENT;
  constructor(public payload: Ingredient) {}
}

export class AddIngredients implements Action {
  readonly type: string = ADD_INGREDIENTS;
  constructor(public payload: Ingredient[]) {}
}

export class UpdateIngredient extends BaseAction<Ingredient> {
  override type: string = UPDATE_INGREDIENT;
}

export class DeleteIngredient extends BaseAction<null> {
  override type: string = DELETE_INGREDIENT;
}

export class StartEdit extends BaseAction<number> {
  override type: string = START_EDIT;
}

export class StopEdit extends BaseAction<null> {
  override type: string = STOP_EDIT;
}

export type ShoppingListActions =
  | AddIngredient
  | AddIngredients
  | UpdateIngredient
  | DeleteIngredient
  | StartEdit
  | StopEdit;
