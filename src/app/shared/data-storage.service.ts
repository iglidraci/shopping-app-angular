import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Ingredient } from './ingredient.model';
import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class DataStorageService {
    constructor(private http: HttpClient,
                private recipeService: RecipeService,
                private authService: AuthService) {}

    storeRecipes(): void {
        const recipes = this.recipeService.getRecipes();
        this.http.put('https://angular-recipe-76dc5.firebaseio.com/recipes.json', recipes)
        .subscribe(response => {
            console.log(response);
        });
    }

    fetchRecipes(): Observable<{
        ingredients: Ingredient[];
        name: string;
        description: string;
        imagePath: string;
    }[]>{
        // this take 1 takes only one user the moment we fetch we dont care about futere changes
        // exhastMap waits for the first observable to complete
            return this.http.get<Recipe[]>('https://angular-recipe-76dc5.firebaseio.com/recipes.json'
            ).pipe(
                map(recipes => {
                    return recipes.map(recipe => {
                        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
                    });
                }),
                tap(recipes => {
                    this.recipeService.overrideRecipes(recipes);
                })
            );
    }
}
