export interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
    description: string;
    category: string;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface User {
    name: string;
    email: string;
    avatar?: string;
}

export interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
}

export interface CartState {
    items: CartItem[];
    wishlist: number[];
}

export interface ProfileState {
    user: User;
    uploading: boolean;
}