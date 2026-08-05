export interface RecipeOverview {
    name: string;
}

export interface Recipe {
    id: number | null;
    rowVersion: number | null;
    name: string;
    singleIngredients: Ingredient[];
    ingredientGroups: IngredientGroup[];
    preparation: string;
}

export interface Ingredient {
    id: number | null;
    rowVersion: number | null;
    name: string;
    quantity: string;
    unit: string | null;
    subgroup: string | null;
}

export interface IngredientGroup {
    name: string;
    ingredients: Ingredient[];
}