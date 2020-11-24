import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;
  constructor(private recipeService: RecipeService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.recipe = this.recipeService.getRecipe(this.id);
      }
    );
  }
  onAddToShoppingList(): void{
    this.recipeService.addIngredientsToList(this.recipe.ingredients);
  }

  onEditRecipe(): void{
    this.router.navigate(['edit'], {relativeTo: this.route});
  }
  onDelete(): void{
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }

}
