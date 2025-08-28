export namespace CheckoutTypes {
    export interface Item {
        id: number;
        status: string;
        status_display: string;
        created_at: string;
        updated_at: string;
        order_type: string;
        checkout_step: string;
        checkout_step_display: string;
        start_date: string;
        end_date: string;
        work_address: string;
        items: Items[];
        total_price: number;
    }

    export interface Items {
        id: number;
        tool: Tool;
        quantity: number;
        rental_days: number;
        price: number;
    }

    export interface Tool {
        tool_id: number;
        name: string;
        description: string;
        category: Category;
        brand: string;
        price_per_day: string;
        final_price: number;
        stock_quantity: number;
        status: string;
        discount: string;
        badge: string;
        main_image: string | null;
        is_available: boolean;
    }

    export interface Category {
        category_id: number;
        name: string;
        description: string;
    }
}
