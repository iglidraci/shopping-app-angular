import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) shoppingListForm: NgForm;
  subscritption: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private slService: ShoppingListService) { }
  ngOnDestroy(): void {
    this.subscritption.unsubscribe();
  }

  ngOnInit(): void {
    this.subscritption = this.slService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItemIndex = index;
        this.editedItem = this.slService.getIngredient(index);
        this.shoppingListForm.setValue({
          ingredient_name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    );
  }

  onSubmitIngredient(form: NgForm): void{
    const value = form.value;
    const  newIgnredient = new Ingredient(value.ingredient_name, value.amount);
    if (this.editMode){
      this.slService.updateIngredient(this.editedItemIndex, newIgnredient);
    }
    else{
      this.slService.addIngredient(newIgnredient);
    }
    this.shoppingListForm.reset();
    this.editMode = false;
  }

  onClear(): void{
    this.shoppingListForm.reset();
    this.editMode = false;
  }
  onDelete(): void{
    if (this.editMode) {
      this.slService.deleteIngredient(this.editedItemIndex);
      this.onClear();
    }
  }

}
