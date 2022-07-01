import { EventEmitter, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { AppStore } from '../app.reducer';

import { Recipe } from '../recipes/recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';

@Injectable()
export class RecipeService {
  recipesChanges = new Subject<Recipe[]>();
  recipeSeleceted = new Subject<Recipe>();

  private _recipes: Recipe[] = [
    // new Recipe(
    //   1,
    //   'Losos',
    //   'Losos on the smoke',
    //   `https://media.istockphoto.com/photos/salad-with-quinoa-salmon-spinach-black-olives-lemon-and-cherry-in
    //       -a-picture-id1307443954?b=1&k=20&m=1307443954&s=170667a&w=0&h=XBDdmpwBrQZImsPUNXYqOTA9apslfx7BbzGpqjm9LNA=`,
    //   [new Ingredient('Losos', 1)]
    // ),
    // new Recipe(
    //   2,
    //   'Vegitables',
    //   'Vegitables on the table',
    //   `https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8
    //        Mnx8cmVjaXBlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60`,
    //   [new Ingredient('Onion', 2), new Ingredient('Mushrooms', 3)]
    // ),
  ];

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<AppStore>
  ) {}

  getRecipes() {
    return this._recipes.slice();
  }

  getRecipe(recipeId: number) {
    return this._recipes.find((recipe) => recipe.id == recipeId);
  }

  addToShoppingList(ingredients: Ingredient[]) {
    // ingredients.forEach((ingredient) => {
    //   this.shoppingListService.addIngredient(ingredient);
    // });
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  addRecipe(recipe: Recipe) {
    recipe = { ...recipe, id: this.getMaxId() };
    this._recipes.push(recipe);
    this.recipesChanges.next(this._recipes.slice());
  }

  updateRecipe(recipeId: number, recipe: Recipe) {
    const recipeIndex = this._recipes.findIndex((item) => item.id === recipeId);
    if (recipeIndex < 0) {
      return;
    }
    recipe = { ...recipe, id: recipeId };
    this._recipes[recipeIndex] = recipe;
    this.recipesChanges.next(this._recipes.slice());
  }

  deleteRecipe(recipeId: number) {
    const recipeIndex = this._recipes.findIndex((item) => item.id === recipeId);
    this._recipes.splice(recipeIndex, 1);
    this.recipesChanges.next(this._recipes.slice());
  }

  reloadRecipes(recipes: Recipe[]) {
    this._recipes = recipes;
    this.recipesChanges.next(this._recipes.slice());
  }

  getMaxId() {
    return <number>this._recipes.map((item) => item.id).pop() + 1;
  }
}
