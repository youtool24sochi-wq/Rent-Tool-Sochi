export namespace FavoritesTypes {
    export interface FavoritesResponse {
        favorites: Favorite[];
        count: number;
    }

    export interface Favorite {
        tool_id: number;
        name: string;
        description: string;
        category: Category;
        brand: string;
        price_per_day: string;
        final_price: string;
        stock_quantity: number;
        status: string;
        discount: string;
        badge: string;
        main_image: string | null;
        is_available: boolean;
        specs: Record<string, string> | string;
    }
    export interface Category {
        category_id: number;
        name: string;
        description: string;
    }
}
