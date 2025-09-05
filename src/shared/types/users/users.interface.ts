export namespace UsersTypes {
  export interface Individual {
    id: number
    username: string
    is_complete: boolean
    is_active: boolean
    date_joined: string
    first_name: string
    middle_name: string
    last_name: string
    name: string
    full_name: string
    address: string
    work_address?: string | null
    passport_series: string
    passport_number: string
    passport_issued_by: string
    passport_issued_date: string
    passport_department: string
    birth_date: string
    birth_place: string
    phone_number?: string
    phone?: string,
    email?: string | undefined
    inn?: string
    avatar?: string | null
    email_verified: boolean
  }

  export interface Legal {
    is_complete: boolean
    user: number
    phone: string
    organization_type: 'LLC' | 'IP'
    company_name: string
    legal_address: string
    inn: string
    kpp: string
    bank_account: string
    director_full_name: string
    director_passport_scan?: string | null
    work_address?: string | null
    email?: string
    updated_at: string,
    id: string
  }

  export interface Order {
    id: number
    status: string
    status_display: string
    created_at: string
    updated_at: string
    order_type: string
    checkout_step: string
    checkout_step_display: string
    start_date: string
    end_date: string
    work_address: string
    items: Item[]
    total_price: number
  }

  export interface Item {
    id: number
    tool: Tool
    quantity: number
    rental_days: number
    start_date: string
    end_date: string
    price: number
  }

  export interface Tool {
    tool_id: number
    name: string
    description: string
    category: Category
    brand: string
    price_per_day: string
    final_price: string
    stock_quantity: number
    status: string
    discount: string
    badge: string
    main_image: string | null
    is_available: boolean
    specs: Record<string, any> | string
  }

  export interface Category {
    category_id: number
    name: string
    description: string
  }

}
