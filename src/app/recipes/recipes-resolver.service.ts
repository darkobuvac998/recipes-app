import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';

import { DataStorageService } from '../services/data-storage.service';
import { RecipeService } from '../services/recipe.service';
import { AppStore } from '../store/app.reducer';
import { Recipe } from './recipe.model';

import { Actions, ofType } from '@ngrx/effects';

import * as RecipesActions from '../recipes/store/recipes.actions';

@Injectable({
  providedIn: 'root',
})
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private recipeServices: RecipeService,
    private store: Store<AppStore>,
    private actions$: Actions
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    const recipes = this.recipeServices.getRecipes();
    if (recipes.length == 0) {
      this.store.dispatch(new RecipesActions.FetchRecipes());
      return this.actions$.pipe(ofType(RecipesActions.SET_RECIPES), take(1));
      // return this.dataStorageService.fetchRecipes();
    } else {
      return recipes;
    }
  }
}
