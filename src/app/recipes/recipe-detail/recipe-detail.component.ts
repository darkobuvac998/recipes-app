import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import { RecipeService } from 'src/app/services/recipe.service';
import { AppStore } from 'src/app/store/app.reducer';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: any;
  recipeId: number;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppStore>
  ) {}

  ngOnInit(): void {
    this.recipeId = +this.route.snapshot.params['id'];
    this.recipe = this.recipeService.getRecipe(this.recipeId);
    this.route.params
      .pipe(
        map((params) => {
          return +params['id'];
        }),
        switchMap((id) => {
          this.recipeId = id;
          return this.store.select('recipes');
        }),
        map((state) => {
          return state.recipes.find((item) => {
            return item.id == this.recipeId;
          });
        })
      )
      .subscribe((recipe) => {
        this.recipe = recipe;
      });
  }

  addIngredientsToShoppingList() {
    this.recipeService.addToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe() {
    // this.router.navigate(['edit'], { relativeTo: this.route });
    this.router.navigate(['../', this.recipeId, 'edit'], {
      relativeTo: this.route,
    });
  }

  onDeleteRecipe() {
    this.recipeService.deleteRecipe(this.recipeId);
    this.router.navigate(['/recipes']);
  }
}

// if you work with your own observables you need to clean subscription
