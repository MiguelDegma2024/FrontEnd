declare module "my-types" {
    export interface Category {
      id: number;
      name: string;
      key?: string;
    }

  
    export interface Manager {
    id: number;
    name: string;
    email?: string; // opcional, puedes agregar más campos según tu modelo real
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
      category: Category;
    }
  
    export interface Branch {
      id: number;
      name: string;
      location: string;
      managerId: number;
      manager: Manager;
      
      createdAt?: Date;
      updatedAt?: Date;
    }
  
    export interface User {
      id: number;
      name: string;
      email: string;
      password: string;
      role: 'admin' | 'user';
      createdAt?: Date;
      updatedAt?: Date;
    }
  }
  