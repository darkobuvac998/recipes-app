import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppStore } from 'src/app/app.reducer';

import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  editMode = false;

  @ViewChild('form', { static: false }) slForm: NgForm;

  constructor(
    private shoppingListService: ShoppingListService,
    private store: Store<AppStore>
  ) {}

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe({
      next: (stateData) => {
        console.log(stateData);
        let index = stateData.editedIngredientIndex ?? -1;
        if (index > -1) {
          this.editMode = true;
          this.slForm.setValue({
            name: stateData.editedIngredient?.name,
            amount: stateData.editedIngredient?.amount,
          });
        } else {
          this.editMode = false;
        }
      },
    });
  }

  onAddIngredient(form: NgForm) {
    const value = form.value;
    if (value.name == null || value.amount == null) {
      return;
    }
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      // this.shoppingListService.updateIngredient(
      //   this.editedItemIndex,
      //   newIngredient
      // );
      this.store.dispatch(
        new ShoppingListActions.UpdateIngredient(newIngredient)
      );
    } else {
      // this.shoppingListService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }

    this.onClear();
  }

  onClear() {
    this.slForm.reset();
    this.editMode = this.editMode ? !this.editMode : this.editMode;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    // this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }
}
