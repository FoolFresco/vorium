export interface Product {
  id: string; // изменено чтобы подходило под uuid
  name: string;
  price: number;
  category: 'tshirts' | 'hoodies' | 'bottoms' | 'accessories' | 'jewelry';
  image: string;
  description: string;
  colors: string[];
  sizes: string[];
  inStock: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export interface CartItem {
  productId: string; // также изменено чтоб подходило под productid
  quantity: number;
  size: string;
  color: string;
  price: number; // для сохраннеия цены товара во время добавления в корзину
}

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

// mock products data
export const products: Product[] = [
  {
    id: '1', // изменено чтобы подходило под uuid
    name: 'Classic Cotton T-Shirt',
    price: 24.99,
    category: 'tshirts',
    image:
      'https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'High-quality cotton t-shirt with a comfortable fit. Perfect for everyday wear.',
    colors: ['White', 'Black', 'Gray'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: '2',
    name: 'Premium Pullover Hoodie',
    price: 49.99,
    category: 'hoodies',
    image:
      'https://images.pexels.com/photos/7764611/pexels-photo-7764611.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Warm and cozy pullover hoodie made from soft, durable fabric.',
    colors: ['Gray', 'Black', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
  },
  {
    id: '3',
    name: 'Slim Fit Jeans',
    price: 59.99,
    category: 'bottoms',
    image:
      'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Classic slim fit jeans with a modern silhouette. Made from premium denim.',
    colors: ['Blue', 'Black', 'Gray'],
    sizes: ['28', '30', '32', '34', '36'],
    inStock: true,
  },
  {
    id: '4',
    name: 'Stylish Watch',
    price: 89.99,
    category: 'accessories',
    image:
      'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Elegant watch with a stainless steel band and minimalist design.',
    colors: ['Silver', 'Gold', 'Black'],
    sizes: ['One Size'],
    inStock: true,
  },
  {
    id: '5',
    name: 'Graphic Print T-Shirt',
    price: 29.99,
    category: 'tshirts',
    image:
      'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Unique graphic print t-shirt made from 100% organic cotton.',
    colors: ['White', 'Black'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: '6',
    name: 'Zip-Up Hoodie',
    price: 54.99,
    category: 'hoodies',
    image:
      'https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Versatile zip-up hoodie with a modern fit and premium materials.',
    colors: ['Gray', 'Black', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: '7',
    name: 'Chino Pants',
    price: 49.99,
    category: 'bottoms',
    image:
      'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Classic chino pants with a comfortable fit and durable construction.',
    colors: ['Khaki', 'Navy', 'Olive'],
    sizes: ['30', '32', '34', '36'],
    inStock: true,
  },
  {
    id: '8',
    name: 'Leather Belt',
    price: 34.99,
    category: 'accessories',
    image:
      'https://images.pexels.com/photos/45055/pexels-photo-45055.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Premium leather belt with a classic buckle design.',
    colors: ['Brown', 'Black'],
    sizes: ['S', 'M', 'L'],
    inStock: true,
  },
  {
    id: '9',
    name: 'Diamond Pendant Necklace',
    price: 299.99,
    category: 'jewelry',
    image:
      'https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Elegant diamond pendant necklace in sterling silver.',
    colors: ['Silver', 'Gold'],
    sizes: ['One Size'],
    inStock: true,
  },
  {
    id: '10',
    name: 'Pearl Earrings',
    price: 149.99,
    category: 'jewelry',
    image:
      'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=800',
    description:
      'Classic freshwater pearl earrings with sterling silver posts.',
    colors: ['White', 'Pink'],
    sizes: ['One Size'],
    inStock: true,
  },
];

// mock users data
export const users: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    isAdmin: true,
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    isAdmin: false,
  },
];

// mock orders data
export const orders: Order[] = [
  {
    id: 1,
    userId: 2,
    items: [
      {
        productId: '1',
        quantity: 2,
        size: 'M',
        color: 'White',
        price: 24.99,
      },
      {
        productId: '3',
        quantity: 1,
        size: '32',
        color: 'Blue',
        price: 59.99,
      },
    ],
    totalAmount: 109.97,
    status: 'delivered',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    userId: 2,
    items: [
      {
        productId: '2',
        quantity: 1,
        size: 'L',
        color: 'Black',
        price: 49.99,
      },
    ],
    totalAmount: 49.99,
    status: 'processing',
    createdAt: '2024-02-20T14:45:00Z',
  },
];
