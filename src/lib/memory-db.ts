// Simple in-memory database for Vercel deployment
interface User {
  id: number;
  email: string;
  name: string;
  age?: number;
  city?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description?: string;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Order {
  id: number;
  userId: number;
  status: string;
  total: number;
  orderDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
}

// Sample data for demo
const users: User[] = [
  { id: 1, email: 'john@example.com', name: 'John Doe', age: 30, city: 'New York', createdAt: new Date('2024-01-15'), updatedAt: new Date('2024-01-15') },
  { id: 2, email: 'jane@example.com', name: 'Jane Smith', age: 25, city: 'Los Angeles', createdAt: new Date('2024-01-20'), updatedAt: new Date('2024-01-20') },
  { id: 3, email: 'bob@example.com', name: 'Bob Johnson', age: 35, city: 'Chicago', createdAt: new Date('2024-02-01'), updatedAt: new Date('2024-02-01') },
  { id: 4, email: 'alice@example.com', name: 'Alice Brown', age: 28, city: 'Houston', createdAt: new Date('2024-02-10'), updatedAt: new Date('2024-02-10') },
  { id: 5, email: 'charlie@example.com', name: 'Charlie Wilson', age: 42, city: 'Phoenix', createdAt: new Date('2024-02-15'), updatedAt: new Date('2024-02-15') },
];

const products: Product[] = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics', description: 'High-performance laptop', inStock: true, createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01') },
  { id: 2, name: 'Mouse', price: 29.99, category: 'Electronics', description: 'Wireless mouse', inStock: true, createdAt: new Date('2024-01-02'), updatedAt: new Date('2024-01-02') },
  { id: 3, name: 'Keyboard', price: 79.99, category: 'Electronics', description: 'Mechanical keyboard', inStock: true, createdAt: new Date('2024-01-03'), updatedAt: new Date('2024-01-03') },
  { id: 4, name: 'Monitor', price: 299.99, category: 'Electronics', description: '24-inch monitor', inStock: true, createdAt: new Date('2024-01-04'), updatedAt: new Date('2024-01-04') },
  { id: 5, name: 'Chair', price: 199.99, category: 'Furniture', description: 'Ergonomic office chair', inStock: true, createdAt: new Date('2024-01-05'), updatedAt: new Date('2024-01-05') },
  { id: 6, name: 'Desk', price: 349.99, category: 'Furniture', description: 'Standing desk', inStock: false, createdAt: new Date('2024-01-06'), updatedAt: new Date('2024-01-06') },
];

const orders: Order[] = [
  { id: 1, userId: 1, status: 'completed', total: 1079.98, orderDate: new Date('2024-03-01'), createdAt: new Date('2024-03-01'), updatedAt: new Date('2024-03-01') },
  { id: 2, userId: 2, status: 'pending', total: 29.99, orderDate: new Date('2024-03-02'), createdAt: new Date('2024-03-02'), updatedAt: new Date('2024-03-02') },
  { id: 3, userId: 1, status: 'completed', total: 199.99, orderDate: new Date('2024-03-03'), createdAt: new Date('2024-03-03'), updatedAt: new Date('2024-03-03') },
  { id: 4, userId: 3, status: 'completed', total: 729.97, orderDate: new Date('2024-03-04'), createdAt: new Date('2024-03-04'), updatedAt: new Date('2024-03-04') },
  { id: 5, userId: 4, status: 'pending', total: 1299.98, orderDate: new Date('2024-03-05'), createdAt: new Date('2024-03-05'), updatedAt: new Date('2024-03-05') },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const orderItems: OrderItem[] = [
  { id: 1, orderId: 1, productId: 1, quantity: 1, price: 999.99 },
  { id: 2, orderId: 1, productId: 2, quantity: 1, price: 29.99 },
  { id: 3, orderId: 1, productId: 3, quantity: 1, price: 79.99 },
  { id: 4, orderId: 2, productId: 2, quantity: 1, price: 29.99 },
  { id: 5, orderId: 3, productId: 5, quantity: 1, price: 199.99 },
  { id: 6, orderId: 4, productId: 3, quantity: 1, price: 79.99 },
  { id: 7, orderId: 4, productId: 4, quantity: 2, price: 299.99 },
  { id: 8, orderId: 5, productId: 1, quantity: 1, price: 999.99 },
  { id: 9, orderId: 5, productId: 4, quantity: 1, price: 299.99 },
];

// Simple SQL-like query executor for demo purposes
export class MemoryDB {
  static async executeQuery(sql: string): Promise<unknown[]> {
    const normalizedSql = sql.toLowerCase().trim();
    
    // Basic SELECT queries
    if (normalizedSql.startsWith('select * from users')) {
      if (normalizedSql.includes('where')) {
        // Handle simple WHERE clauses
        if (normalizedSql.includes("city = 'new york'")) {
          return users.filter(u => u.city?.toLowerCase() === 'new york');
        }
        if (normalizedSql.includes('age <') || normalizedSql.includes('age<')) {
          const ageMatch = normalizedSql.match(/age\s*<\s*(\d+)/);
          if (ageMatch) {
            const age = parseInt(ageMatch[1]);
            return users.filter(u => u.age && u.age < age);
          }
        }
      }
      return users;
    }
    
    if (normalizedSql.startsWith('select * from products')) {
      if (normalizedSql.includes('where')) {
        if (normalizedSql.includes('price <') || normalizedSql.includes('price<')) {
          const priceMatch = normalizedSql.match(/price\s*<\s*([\d.]+)/);
          if (priceMatch) {
            const price = parseFloat(priceMatch[1]);
            return products.filter(p => p.price < price);
          }
        }
        if (normalizedSql.includes("category = 'electronics'")) {
          return products.filter(p => p.category.toLowerCase() === 'electronics');
        }
        if (normalizedSql.includes('"inStock" = true') || normalizedSql.includes('instock = true')) {
          return products.filter(p => p.inStock);
        }
      }
      return products;
    }
    
    if (normalizedSql.startsWith('select * from orders')) {
      if (normalizedSql.includes('where')) {
        if (normalizedSql.includes("status = 'completed'")) {
          return orders.filter(o => o.status === 'completed');
        }
        if (normalizedSql.includes('total >') || normalizedSql.includes('total>')) {
          const totalMatch = normalizedSql.match(/total\s*>\s*([\d.]+)/);
          if (totalMatch) {
            const total = parseFloat(totalMatch[1]);
            return orders.filter(o => o.total > total);
          }
        }
      }
      return orders;
    }
    
    // JOIN queries
    if (normalizedSql.includes('join')) {
      if (normalizedSql.includes('orders o join users u')) {
        // Orders with user names
        const ordersWithUsers = orders.map(order => {
          const user = users.find(u => u.id === order.userId);
          return {
            ...order,
            userName: user?.name,
            userEmail: user?.email
          };
        });
        
        if (normalizedSql.includes("u.name = 'john doe'")) {
          return ordersWithUsers.filter(o => o.userName?.toLowerCase() === 'john doe');
        }
        
        return ordersWithUsers;
      }
    }
    
    // Default fallback - return some sample data
    return [
      { message: 'Query executed successfully', 
        note: 'This is a demo database with limited query support',
        availableTables: ['users', 'products', 'orders', 'order_items']
      }
    ];
  }
} 