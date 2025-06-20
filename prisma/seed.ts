import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to generate random data
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomPrice(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

async function main() {
  console.log('🗑️  Clearing existing data...');
  // Clear existing data
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // Sample data arrays
  const firstNames = [
    'John', 'Jane', 'Bob', 'Alice', 'Mike', 'Sarah', 'David', 'Emma', 'Chris', 'Lisa',
    'Tom', 'Anna', 'James', 'Mary', 'Robert', 'Jennifer', 'William', 'Linda', 'Richard', 'Patricia',
    'Charles', 'Barbara', 'Joseph', 'Elizabeth', 'Thomas', 'Susan', 'Daniel', 'Jessica', 'Matthew', 'Karen',
    'Anthony', 'Nancy', 'Mark', 'Betty', 'Donald', 'Helen', 'Steven', 'Sandra', 'Paul', 'Donna',
    'Andrew', 'Carol', 'Joshua', 'Ruth', 'Kenneth', 'Sharon', 'Kevin', 'Michelle', 'Brian', 'Laura',
    'George', 'Sarah', 'Timothy', 'Kimberly', 'Ronald', 'Deborah', 'Jason', 'Dorothy', 'Edward', 'Lisa',
    'Jeffrey', 'Nancy', 'Ryan', 'Karen', 'Jacob', 'Betty', 'Gary', 'Helen', 'Nicholas', 'Sandra',
    'Eric', 'Donna', 'Jonathan', 'Carol', 'Stephen', 'Ruth', 'Larry', 'Sharon', 'Justin', 'Michelle'
  ];

  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
    'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
  ];

  const cities = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego',
    'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'San Francisco', 'Columbus', 'Charlotte', 'Fort Worth',
    'Indianapolis', 'Seattle', 'Denver', 'Boston', 'El Paso', 'Detroit', 'Nashville', 'Portland',
    'Memphis', 'Oklahoma City', 'Las Vegas', 'Louisville', 'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson',
    'Fresno', 'Sacramento', 'Mesa', 'Kansas City', 'Atlanta', 'Long Beach', 'Colorado Springs', 'Raleigh',
    'Miami', 'Virginia Beach', 'Omaha', 'Oakland', 'Minneapolis', 'Tulsa', 'Arlington', 'Tampa'
  ];

  const categories = ['Electronics', 'Home & Kitchen', 'Sports', 'Books', 'Clothing', 'Beauty', 'Automotive', 'Toys'] as const;

  const productNames: Record<typeof categories[number], string[]> = {
    'Electronics': [
      'Laptop', 'Smartphone', 'Tablet', 'Smartwatch', 'Headphones', 'Wireless Earbuds', 'Gaming Console',
      'Monitor', 'Keyboard', 'Mouse', 'Webcam', 'Microphone', 'Router', 'Hard Drive', 'SSD',
      'Graphics Card', 'Motherboard', 'RAM', 'Power Supply', 'Cooling Fan'
    ],
    'Home & Kitchen': [
      'Coffee Maker', 'Blender', 'Toaster', 'Microwave', 'Air Fryer', 'Slow Cooker', 'Food Processor',
      'Stand Mixer', 'Rice Cooker', 'Pressure Cooker', 'Vacuum Cleaner', 'Air Purifier', 'Humidifier',
      'Dehumidifier', 'Space Heater', 'Fan', 'Lamp', 'Curtains', 'Pillow', 'Bedsheet Set'
    ],
    'Sports': [
      'Running Shoes', 'Basketball', 'Soccer Ball', 'Tennis Racket', 'Golf Clubs', 'Yoga Mat',
      'Dumbbells', 'Resistance Bands', 'Treadmill', 'Exercise Bike', 'Protein Powder', 'Water Bottle',
      'Gym Bag', 'Fitness Tracker', 'Swimming Goggles', 'Bicycle Helmet', 'Skateboard', 'Football',
      'Baseball Glove', 'Hiking Boots'
    ],
    'Books': [
      'Fiction Novel', 'Science Textbook', 'Cookbook', 'Biography', 'Self-Help Book', 'History Book',
      'Art Book', 'Programming Guide', 'Language Learning', 'Travel Guide', 'Poetry Collection',
      'Mystery Novel', 'Romance Novel', 'Fantasy Novel', 'Science Fiction', 'Thriller', 'Horror Novel',
      'Philosophy Book', 'Psychology Book', 'Business Book'
    ],
    'Clothing': [
      'T-Shirt', 'Jeans', 'Dress', 'Sweater', 'Jacket', 'Sneakers', 'Boots', 'Sandals', 'Hat',
      'Scarf', 'Gloves', 'Socks', 'Underwear', 'Pajamas', 'Swimsuit', 'Suit', 'Tie', 'Belt',
      'Sunglasses', 'Watch'
    ],
    'Beauty': [
      'Shampoo', 'Conditioner', 'Face Cream', 'Sunscreen', 'Lipstick', 'Foundation', 'Mascara',
      'Perfume', 'Nail Polish', 'Hair Dryer', 'Straightener', 'Curling Iron', 'Moisturizer',
      'Cleanser', 'Serum', 'Toner', 'Exfoliator', 'Face Mask', 'Eye Cream', 'Body Lotion'
    ],
    'Automotive': [
      'Car Tire', 'Motor Oil', 'Car Battery', 'Brake Pads', 'Air Filter', 'Spark Plugs',
      'Car Wax', 'Car Cover', 'Floor Mats', 'Seat Covers', 'Dash Cam', 'GPS Navigator',
      'Car Charger', 'Phone Mount', 'Jumper Cables', 'Emergency Kit', 'Tire Pressure Gauge',
      'Car Vacuum', 'Cleaning Supplies', 'Tool Kit'
    ],
    'Toys': [
      'Action Figure', 'Doll', 'Board Game', 'Puzzle', 'LEGO Set', 'Stuffed Animal', 'RC Car',
      'Drone', 'Video Game', 'Trading Cards', 'Art Supplies', 'Musical Instrument', 'Building Blocks',
      'Educational Toy', 'Outdoor Toy', 'Bath Toy', 'Electronic Toy', 'Craft Kit', 'Science Kit',
      'Model Kit'
    ]
  };

  const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'];

  console.log('👥 Creating users...');
  // Create 300 users
  const users = [];
  for (let i = 0; i < 300; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const user = await prisma.user.create({
      data: {
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
        name: `${firstName} ${lastName}`,
        age: Math.floor(Math.random() * 50) + 18, // Age between 18-67
        city: getRandomElement(cities),
        createdAt: getRandomDate(new Date('2020-01-01'), new Date()),
      },
    });
    users.push(user);
  }

  console.log('🛍️  Creating products...');
  // Create 100 products
  const products = [];
  for (let i = 0; i < 100; i++) {
    const category = getRandomElement([...categories]) as keyof typeof productNames;
    const productName = getRandomElement(productNames[category]) as string;
    const product = await prisma.product.create({
      data: {
        name: `${productName} ${i + 1}`,
        price: getRandomPrice(9.99, 999.99),
        category: category,
        description: `High-quality ${productName.toLowerCase()} with excellent features`,
        inStock: Math.random() > 0.1, // 90% in stock
        createdAt: getRandomDate(new Date('2020-01-01'), new Date()),
      },
    });
    products.push(product);
  }

  console.log('📦 Creating orders...');
  // Create 500 orders
  const orders = [];
  for (let i = 0; i < 500; i++) {
    const user = getRandomElement(users);
    const status = getRandomElement(orderStatuses);
    const orderDate = getRandomDate(new Date('2020-01-01'), new Date());
    
    // Create 1-5 order items per order
    const numItems = Math.floor(Math.random() * 5) + 1;
    const orderItems = [];
    let total = 0;
    
    for (let j = 0; j < numItems; j++) {
      const product = getRandomElement(products);
      const quantity = Math.floor(Math.random() * 3) + 1;
      const price = product.price;
      
      orderItems.push({
        productId: product.id,
        quantity: quantity,
        price: price,
      });
      
      total += Number(price) * quantity;
    }
    
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: status,
        total: Math.round(total * 100) / 100,
        orderDate: orderDate,
        createdAt: orderDate,
        orderItems: {
          create: orderItems,
        },
      },
    });
    orders.push(order);
  }

  console.log('✅ Database seeded successfully!');
  console.log(`Created ${users.length} users`);
  console.log(`Created ${products.length} products`);
  console.log(`Created ${orders.length} orders`);
  
  // Calculate total order items
  const totalOrderItems = await prisma.orderItem.count();
  console.log(`Created ${totalOrderItems} order items`);
  console.log(`Total records: ${users.length + products.length + orders.length + totalOrderItems}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 