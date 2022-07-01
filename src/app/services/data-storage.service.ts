import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { RecipeService } from './recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
}) // provided application wide
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        'https://shop-app-8991f-default-rtdb.firebaseio.com/recipes.json',
        recipes
      )
      .subscribe({
        next: (response) => {},
      });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        `https://shop-app-8991f-default-rtdb.firebaseio.com/recipes.json`
      )
      .pipe(
        map((recipes) => {
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap((recipes) => {
          this.recipeService.reloadRecipes(recipes);
        })
      );
  }
}
