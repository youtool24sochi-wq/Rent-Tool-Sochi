import { StaticImageData } from 'next/image'

export namespace CartType {
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
        main_image: string | StaticImageData;
        badge: string;
        stock_quantity: number
    }

    export interface Form {
        tool_id: number
    }

    export interface ToolItem {
        tool_id: number
        end_date: number
        quantity: number
    }

    export interface CheckoutRequestData {
        tool_ids: ToolItem[]
        start_date: string
    }
}
