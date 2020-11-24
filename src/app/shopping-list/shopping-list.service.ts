import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';

export class ShoppingListService {
    // inform our component that new data is available because we give them a copy of ingredients list
    ignredientsChanged = new Subject<Ingredient[]>(); // like event emmiter
    startedEditing = new Subject<number>();
    private ingredients: Ingredient[] = [
        new Ingredient('Apple', 5),
        new Ingredient('Cucamber', 10),
        new Ingredient('Bread', 10)
      ];

      getIngredients(): Ingredient[]{
          return this.ingredients.slice();
      }

      addIngredient(ingredient: Ingredient): void{
          this.ingredients.push(ingredient);
          this.ignredientsChanged.next(this.ingredients.slice());
      }

      addIngredients(ingredients: Ingredient[]): void{
          this.ingredients.push(...ingredients);
          this.ignredientsChanged.next(this.ingredients.slice());
      }

      getIngredient(index: number): Ingredient{
          return this.ingredients[index];
      }

      updateIngredient(index: number, newIngredient: Ingredient): void{
          this.ingredients[index] = newIngredient;
          this.ignredientsChanged.next(this.ingredients.slice());
      }

      deleteIngredient(index: number): void{
          this.ingredients.splice(index, 1);
          this.ignredientsChanged.next(this.ingredients.slice());
      }

}
