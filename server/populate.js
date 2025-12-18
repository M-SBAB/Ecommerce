import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.js';
import Product from './models/products.js';
import Order from './models/order.js';

dotenv.config();

// Realistic product data for an e-commerce store
const productCategories = {
  Electronics: [
    {
      name: 'iPhone 15 Pro Max',
      price: 1199,
      description:
        'Latest Apple flagship smartphone with A17 Pro chip, 256GB storage, and advanced camera system',
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      price: 1099,
      description:
        'Premium Android smartphone with S Pen, 200MP camera, and stunning AMOLED display',
    },
    {
      name: 'Sony WH-1000XM5 Headphones',
      price: 399,
      description:
        'Industry-leading noise cancelling wireless headphones with exceptional sound quality',
    },
    {
      name: 'MacBook Pro 14"',
      price: 1999,
      description:
        'Apple M3 Pro chip, 16GB RAM, 512GB SSD, perfect for professionals and creators',
    },
    {
      name: 'Dell XPS 15',
      price: 1599,
      description:
        'High-performance laptop with Intel Core i7, 16GB RAM, and stunning 4K display',
    },
    {
      name: 'iPad Air 2024',
      price: 599,
      description:
        'Versatile tablet with M2 chip, perfect for work and entertainment',
    },
    {
      name: 'Apple Watch Series 9',
      price: 429,
      description:
        'Advanced health tracking, fitness features, and seamless iPhone integration',
    },
    {
      name: 'Samsung Galaxy Watch 6',
      price: 349,
      description:
        'Smart watch with comprehensive health monitoring and long battery life',
    },
    {
      name: 'Bose QuietComfort Earbuds',
      price: 299,
      description: 'True wireless earbuds with world-class noise cancellation',
    },
    {
      name: 'Canon EOS R6 Mark II',
      price: 2499,
      description:
        'Professional mirrorless camera with 24.2MP sensor and advanced autofocus',
    },
  ],
  'Home & Kitchen': [
    {
      name: 'Dyson V15 Vacuum',
      price: 649,
      description:
        'Powerful cordless vacuum with laser detection and HEPA filtration',
    },
    {
      name: 'Ninja Air Fryer',
      price: 129,
      description:
        'Large capacity air fryer for healthier cooking with less oil',
    },
    {
      name: 'KitchenAid Stand Mixer',
      price: 379,
      description: 'Professional-grade mixer for all your baking needs',
    },
    {
      name: 'Instant Pot Duo',
      price: 99,
      description:
        '7-in-1 programmable pressure cooker for quick and easy meals',
    },
    {
      name: 'Nespresso Coffee Maker',
      price: 199,
      description:
        'Premium espresso machine for barista-quality coffee at home',
    },
    {
      name: 'Cuisinart Food Processor',
      price: 149,
      description: '14-cup capacity for all your food prep needs',
    },
    {
      name: 'iRobot Roomba j7+',
      price: 799,
      description:
        'Smart robot vacuum with automatic dirt disposal and obstacle avoidance',
    },
    {
      name: 'Vitamix Blender',
      price: 449,
      description: 'Professional-grade blender for smoothies, soups, and more',
    },
    {
      name: 'Lodge Cast Iron Skillet',
      price: 34,
      description: 'Pre-seasoned 12-inch skillet for versatile cooking',
    },
    {
      name: 'OXO Kitchen Utensil Set',
      price: 49,
      description:
        'Complete set of essential kitchen tools with comfortable grips',
    },
  ],
  Fashion: [
    {
      name: "Levi's 501 Original Jeans",
      price: 89,
      description: 'Classic straight-fit jeans with timeless style',
    },
    {
      name: 'Nike Air Max 270',
      price: 159,
      description: 'Comfortable lifestyle sneakers with Max Air cushioning',
    },
    {
      name: 'Adidas Ultraboost 23',
      price: 189,
      description: 'Premium running shoes with responsive Boost technology',
    },
    {
      name: 'Ray-Ban Aviator Sunglasses',
      price: 154,
      description: 'Iconic sunglasses with UV protection and timeless design',
    },
    {
      name: 'The North Face Jacket',
      price: 299,
      description:
        'Waterproof and breathable outdoor jacket for all conditions',
    },
    {
      name: 'Columbia Hiking Boots',
      price: 139,
      description: 'Durable hiking boots with excellent traction and support',
    },
    {
      name: 'Patagonia Fleece',
      price: 149,
      description: 'Warm and sustainable fleece jacket for outdoor adventures',
    },
    {
      name: 'Tommy Hilfiger Polo Shirt',
      price: 69,
      description: 'Classic polo shirt with premium cotton fabric',
    },
    {
      name: 'Calvin Klein Boxer Briefs Pack',
      price: 42,
      description: 'Comfortable underwear pack with stretch cotton',
    },
    {
      name: 'Fossil Leather Watch',
      price: 159,
      description: 'Elegant analog watch with genuine leather strap',
    },
  ],
  'Sports & Fitness': [
    {
      name: 'Bowflex Adjustable Dumbbells',
      price: 549,
      description: 'Space-saving dumbbells with quick weight adjustment',
    },
    {
      name: 'Peloton Bike',
      price: 1445,
      description: 'Interactive fitness bike with live and on-demand classes',
    },
    {
      name: 'Yoga Mat Premium',
      price: 59,
      description: 'Extra-thick yoga mat with excellent grip and cushioning',
    },
    {
      name: 'Fitbit Charge 6',
      price: 159,
      description: 'Advanced fitness tracker with heart rate and GPS',
    },
    {
      name: 'TRX Suspension Trainer',
      price: 179,
      description: 'Complete bodyweight training system for home workouts',
    },
    {
      name: 'Resistance Bands Set',
      price: 29,
      description: 'Five-band set for strength training and stretching',
    },
    {
      name: 'Foam Roller',
      price: 34,
      description: 'High-density foam roller for muscle recovery and massage',
    },
    {
      name: 'Jump Rope Speed Rope',
      price: 24,
      description: 'Adjustable speed rope for cardio and coordination training',
    },
    {
      name: 'Kettlebell Set',
      price: 149,
      description: 'Cast iron kettlebells for functional strength training',
    },
    {
      name: 'Exercise Bike Stationary',
      price: 399,
      description: 'Sturdy indoor cycling bike with adjustable resistance',
    },
  ],
  Books: [
    {
      name: 'Atomic Habits',
      price: 27,
      description: "James Clear's transformative guide to building good habits",
    },
    {
      name: 'The Psychology of Money',
      price: 18,
      description:
        "Morgan Housel's insights on wealth and financial decision-making",
    },
    {
      name: 'Project Hail Mary',
      price: 29,
      description: "Andy Weir's thrilling science fiction adventure",
    },
    {
      name: '4-Hour Work Week',
      price: 22,
      description: "Tim Ferriss's guide to lifestyle design and productivity",
    },
    {
      name: 'Educated: A Memoir',
      price: 19,
      description: "Tara Westover's powerful story of self-education",
    },
    {
      name: 'Dune',
      price: 21,
      description: "Frank Herbert's epic science fiction masterpiece",
    },
    {
      name: 'Sapiens',
      price: 24,
      description: "Yuval Noah Harari's brief history of humankind",
    },
    {
      name: 'The Midnight Library',
      price: 26,
      description: "Matt Haig's heartwarming tale about life's possibilities",
    },
    {
      name: 'Thinking, Fast and Slow',
      price: 20,
      description: "Daniel Kahneman's exploration of human decision-making",
    },
    {
      name: 'Born a Crime',
      price: 18,
      description: "Trevor Noah's memoir about growing up in South Africa",
    },
  ],
};

// Generate realistic user names
const firstNames = [
  'John',
  'Emma',
  'Michael',
  'Sophia',
  'William',
  'Olivia',
  'James',
  'Ava',
  'Robert',
  'Isabella',
  'David',
  'Mia',
  'Richard',
  'Charlotte',
  'Joseph',
  'Amelia',
  'Thomas',
  'Harper',
  'Daniel',
  'Evelyn',
  'Matthew',
  'Abigail',
  'Christopher',
  'Emily',
];
const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Anderson',
  'Taylor',
  'Thomas',
  'Moore',
  'Jackson',
  'Martin',
  'Lee',
  'Thompson',
  'White',
  'Harris',
  'Clark',
  'Lewis',
  'Walker',
  'Hall',
];

// Generate realistic addresses
const cities = [
  'New York',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Phoenix',
  'Philadelphia',
  'San Antonio',
  'San Diego',
  'Dallas',
  'Austin',
  'Jacksonville',
  'Fort Worth',
  'Columbus',
  'Charlotte',
  'Seattle',
  'Denver',
  'Boston',
  'Portland',
  'Miami',
  'Atlanta',
];
const states = [
  'NY',
  'CA',
  'IL',
  'TX',
  'AZ',
  'PA',
  'TX',
  'CA',
  'TX',
  'TX',
  'FL',
  'TX',
  'OH',
  'NC',
  'WA',
  'CO',
  'MA',
  'OR',
  'FL',
  'GA',
];
const streets = [
  'Main St',
  'Oak Ave',
  'Park Blvd',
  'Maple Dr',
  'Cedar Lane',
  'Pine St',
  'Elm Ave',
  'Washington St',
  'Lake Dr',
  'Hill Rd',
];

// Helper function to get random item from array
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper function to generate random number in range
const randomInRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to generate random date in past year
const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const populateDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(
      'mongodb+srv://s22bdocs1m01174_db_user:nAiWZxj1sT8IB2Nv@maincluster.gehzeyy.mongodb.net/ecommerce_db?appName=Mohsin-FYP'
    );
    console.log('✅ Connected to MongoDB');

    // Check if admin exists
    console.log('\n👤 Checking for existing admin...');
    const existingAdmin = await User.findOne({ role: 'admin' });

    let adminUser;
    if (existingAdmin) {
      console.log('✅ Admin already exists:', existingAdmin.username);
      adminUser = existingAdmin;
    } else {
      console.log('📝 Creating admin user...');
      adminUser = await User.create({
        username: 'admin',
        password: 'admin123', // In production, this should be hashed
        role: 'admin',
      });
      console.log('✅ Admin user created:', adminUser.username);
    }

    // Create users
    console.log('\n👥 Creating users...');
    const users = [adminUser]; // Include admin in users array

    // Generate 20-24 regular users (so total is at least 20 with admin)
    const numUsers = randomInRange(19, 23);
    for (let i = 0; i < numUsers; i++) {
      const firstName = getRandom(firstNames);
      const lastName = getRandom(lastNames);
      const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomInRange(
        1,
        999
      )}`;

      const user = await User.create({
        username,
        password: 'password123', // In production, this should be hashed
        role: 'user',
      });
      users.push(user);
    }
    console.log(`✅ Created ${users.length} users (including admin)`);

    // Create products
    console.log('\n📦 Creating products...');
    const products = [];

    for (const [category, items] of Object.entries(productCategories)) {
      for (const item of items) {
        const product = await Product.create({
          productName: item.name,
          category,
          price: item.price,
          quantity: randomInRange(5, 200), // Random stock quantity
          description: item.description,
        });
        products.push(product);
      }
    }
    console.log(
      `✅ Created ${products.length} products across ${
        Object.keys(productCategories).length
      } categories`
    );

    // Create orders
    console.log('\n🛒 Creating orders...');
    const orderStatuses = [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ];
    const paymentMethods = [
      'cash_on_delivery',
      'credit_card',
      'debit_card',
      'online',
    ];
    const paymentStatuses = ['pending', 'paid', 'failed', 'refunded'];

    const numOrders = 200;
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    for (let i = 0; i < numOrders; i++) {
      // Select random user (excluding admin for more realistic data, but admin can have some orders)
      const user = getRandom(users);

      // Generate customer info
      const firstName = getRandom(firstNames);
      const lastName = getRandom(lastNames);
      const cityIndex = randomInRange(0, cities.length - 1);

      // Select random products for this order (1-5 items)
      const numItems = randomInRange(1, 5);
      const orderItems = [];
      let totalAmount = 0;

      for (let j = 0; j < numItems; j++) {
        const product = getRandom(products);
        const quantity = randomInRange(1, 3);
        const subtotal = product.price * quantity;

        orderItems.push({
          productId: product._id,
          productName: product.productName,
          price: product.price,
          quantity,
          subtotal,
        });

        totalAmount += subtotal;
      }

      // Select status with realistic distribution
      // More delivered orders, fewer cancelled
      const statusRandom = Math.random();
      let status;
      if (statusRandom < 0.45) status = 'delivered';
      else if (statusRandom < 0.7) status = 'shipped';
      else if (statusRandom < 0.85) status = 'processing';
      else if (statusRandom < 0.95) status = 'pending';
      else status = 'cancelled';

      // Payment status based on order status
      let paymentStatus;
      if (status === 'delivered' || status === 'shipped')
        paymentStatus = 'paid';
      else if (status === 'cancelled')
        paymentStatus = Math.random() > 0.5 ? 'refunded' : 'failed';
      else if (status === 'processing')
        paymentStatus = Math.random() > 0.7 ? 'paid' : 'pending';
      else paymentStatus = 'pending';

      const order = await Order.create({
        userId: user._id,
        customerName: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        phoneNumber: `+1${randomInRange(2000000000, 9999999999)}`,
        address: `${randomInRange(100, 9999)} ${getRandom(streets)}`,
        city: cities[cityIndex],
        state: states[cityIndex],
        zipCode: `${randomInRange(10000, 99999)}`,
        country: 'USA',
        items: orderItems,
        totalAmount,
        status,
        paymentMethod: getRandom(paymentMethods),
        paymentStatus,
        createdAt: randomDate(oneYearAgo, new Date()),
      });
    }
    console.log(`✅ Created ${numOrders} orders with various statuses`);

    // Print summary
    console.log('\n📊 Database Population Summary:');
    console.log('================================');
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();

    console.log(`👥 Total Users: ${userCount}`);
    console.log(`   - Admins: ${await User.countDocuments({ role: 'admin' })}`);
    console.log(
      `   - Regular Users: ${await User.countDocuments({ role: 'user' })}`
    );

    console.log(`\n📦 Total Products: ${productCount}`);
    for (const category of Object.keys(productCategories)) {
      const count = await Product.countDocuments({ category });
      console.log(`   - ${category}: ${count}`);
    }

    console.log(`\n🛒 Total Orders: ${orderCount}`);
    for (const status of orderStatuses) {
      const count = await Order.countDocuments({ status });
      console.log(`   - ${status}: ${count}`);
    }

    console.log('\n🎉 Database populated successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('   Admin: username="admin", password="admin123"');
    console.log(
      '   Users: username="[firstname].[lastname][number]", password="password123"'
    );
    console.log('   Example: username="john.smith123", password="password123"');
  } catch (error) {
    console.error('❌ Error populating database:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the population script
populateDatabase()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
