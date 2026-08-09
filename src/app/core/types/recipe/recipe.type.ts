export interface RecipeOverview {
    id: number;
    name: string;
}

export interface Recipe {
    id: number | null;
    rowVersion: number | null;
    name: string;
    numberOfPortions: number | null;
    singleIngredients: Ingredient[];
    ingredientGroups: IngredientGroup[];
    preparation: string | null;
}

export interface Ingredient {
    id: number | null;
    rowVersion: number | null;
    name: string;
    quantity: string | null;
    unit: string | null;
    subgroup: string | null;
}

export interface IngredientGroup {
    name: string;
    ingredients: Ingredient[];
}