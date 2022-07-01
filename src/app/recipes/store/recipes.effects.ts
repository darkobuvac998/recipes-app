import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap } from 'rxjs';
import { Recipe } from '../recipe.model';
import { map } from 'rxjs/operators';

import * as RecipesActions from './recipes.actions';

@Injectable()
export class RecipeEffects {
  fetchRecipes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RecipesActions.FETCH_RECIPES),
      switchMap((_) => {
        return this.http.get<Recipe[]>(
          `https://shop-app-8991f-default-rtdb.firebaseio.com/recipes.json`
        );
      }),
      map((recipes) => {
        return recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      map((recipes) => {
        return new RecipesActions.SetRecipes(recipes);
      })
    );
  });

  constructor(private actions$: Actions, private http: HttpClient) {}
}
