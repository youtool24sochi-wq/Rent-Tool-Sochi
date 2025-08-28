export namespace HomeType {
    export interface Product {
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

    export interface Video {
        video_url: {video_url: string}
    }
}
