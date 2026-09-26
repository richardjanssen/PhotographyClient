export interface Groceries {
    products: GroceryListProduct[];
    recurringProducts: GroceryListRecurringProduct[]
}

export interface GroceryListProduct {
    id: number | null;
    rowVersion: number | null;
    name: string;
    recurringProduct: boolean;
    sale: boolean;
    albertHeijn: boolean;
}

export interface GroceryListRecurringProduct {
    id: number | null;
    rowVersion: number | null;
    name: string;
    order: number;
}