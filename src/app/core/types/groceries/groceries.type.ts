export interface Groceries {
    products: GroceryListProduct[];
    recurringProducts: GroceryListRecurringProduct[]
}

export interface GroceryListProduct {
    id: number;
    name: string;
    recurringProduct: boolean;
    sale: boolean;
}

export interface GroceryListRecurringProduct {
    id: number;
    name: string;
    order: number;
}