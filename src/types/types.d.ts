declare module "my-types" {

    export interface Category {
    
    id: number;
    
    name: string;
    
    }
    
    
    export interface Product {
    
    id: number;
    
    title: string;
    
    description: string;
    
    price: number;
    
    discountPercentage: number;
    
    rating: number;
    
    stock: number;
    
    categoryId: number;
    
    category: Category ;
    
    }
    
    }