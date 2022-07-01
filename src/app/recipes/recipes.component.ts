import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from './recipe.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit {
  selectedRecipe: Recipe;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.recipeSeleceted.subscribe((recipe: Recipe) => {
      this.selectedRecipe = recipe;
    });
  }

  onRecipeSelected(recipe: Recipe) {
    this.selectedRecipe = recipe;
  }
}
