import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService{
    recipesChanged = new Subject<Recipe[]>();
    // private recipes: Recipe[] = [
    //     new Recipe('Test3', 'This is a test',
    //     'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg',
    //     [
    //         new Ingredient('Meat', 1),
    //         new Ingredient('French Fries', 20)
    //     ]),
    //     new Recipe('Test1', 'This is another test',
    //     'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg',
    //     [
    //         new Ingredient('Buns', 2),
    //         new Ingredient('Meat', 1)
    //     ]),
    //     new Recipe('Test2', 'This is another test',
    //     'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg',
    //     [
    //         new Ingredient('Buns', 2),
    //         new Ingredient('Meat', 1)
    //     ])
    //   ];

    private recipes: Recipe[] = [];
      constructor(private slService: ShoppingListService) {}

      getRecipes(): Recipe[] {
          // return a copy of array
          return this.recipes.slice();
      }
      addIngredientsToList(ingredients: Ingredient[]): void{
          this.slService.addIngredients(ingredients);
      }

      getRecipe(id: number): Recipe{
          return this.recipes[id];
      }

      addRecipe(recipe: Recipe): void{
          this.recipes.push(recipe);
          this.recipesChanged.next(this.recipes.slice());
      }

      updateRecipe(index: number, newRecipe: Recipe): void{
          this.recipes[index] = newRecipe;
          this.recipesChanged.next(this.recipes.slice());
      }
      deleteRecipe(index: number): void{
          this.recipes.splice(index, 1);
          this.recipesChanged.next(this.recipes.slice());
      }

      overrideRecipes(recipes: Recipe[]): void{
          this.recipes = recipes;
          this.recipesChanged.next(this.recipes.slice());
      }
}
