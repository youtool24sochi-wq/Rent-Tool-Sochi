
export namespace CatalogProductTypes {
  export interface Item {
    tool_id: number;
    name: string;
    description: string;
    category_id: number;
    brand: string;
    price_per_day: string;
    final_price: number;
    status: string;
    discount: string;
    main_image: {id: number, image: string};
    badge: string;
    is_in_cart: boolean;
    is_in_favorite: boolean;
    is_available: boolean
  }

  export interface ItemDetail {
    tool_id: number;
    name: string;
    description: string;
    category: Category;
    brand: string;
    price_per_day: string;
    final_price: number;
    stock_quantity: number;
    status: string;
    created_at: string;
    discount: string;
    specs: Record<string, string> | string;
    images: string[];
    main_image: string | null;
    badge: string;
    is_in_cart: boolean;
    is_in_favorite: boolean;
    is_available: boolean;
  }

  interface Category {
    category_id: number;
    name: string;
    description: string;
  }

  export interface Categories {
    category_id: number;
    name: string;
    description: string;
    tools_count: number;
  }

  export interface Response {
    count: number
    next: string | null
    previous: string | null
    results: Item[]
  }

  export interface FavoriteForm {
    tool_id: number
  }
}
