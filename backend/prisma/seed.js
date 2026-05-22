const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // 1. Clean existing records in dependency order
  await prisma.rating.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();
  console.log('Cleared existing records.');

  // Common password matching rules: 8-16 chars, 1 uppercase, 1 special character
  const rawPassword = 'Password123!';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  // 2. Create System Administrator
  const adminUser = await prisma.user.create({
    data: {
      name: 'System Administrator Account',
      email: 'admin@gmail.com',
      password: hashedPassword,
      address: 'Central Admin Office, Tech City',
      role: 'ADMIN'
    }
  });
  console.log('Created System Admin:', adminUser.email);

  // 3. Create 3 Normal Users who will submit ratings
  const normalUsersData = [
    { name: 'Amit Kumar Sharma Malik', email: 'amit.kumar@gmail.com', address: 'Sector 62, Noida, Uttar Pradesh' },
    { name: 'Priya Ravindran Srinivasan', email: 'priya.sri@gmail.com', address: 'Indiranagar, Bangalore, Karnataka' },
    { name: 'Siddharth Roy Chowdhury', email: 'sid.roy@gmail.com', address: 'Salt Lake Sector 5, Kolkata, West Bengal' }
  ];

  const normalUsers = [];
  for (const u of normalUsersData) {
    const created = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        password: hashedPassword,
        address: u.address,
        role: 'USER'
      }
    });
    normalUsers.push(created);
    console.log('Created Normal User:', created.email);
  }

  // 4. Create 10 Store Owners & 10 Stores
  const storesData = [
    {
      owner: { name: 'Rajesh Kumar Singhal Gupta', email: 'rajesh.owner@gmail.com', address: 'Saket District Centre, New Delhi' },
      store: { name: 'Starbucks Premium Coffee', email: 'starbucks.saket@gmail.com', address: 'Ground Floor, DLF Avenue, Saket, Delhi' }
    },
    {
      owner: { name: 'Ananya Deshmukh Kulkarni', email: 'ananya.owner@gmail.com', address: 'Juhu Tara Road, Mumbai' },
      store: { name: 'Dominos Artisanal Pizza', email: 'dominos.juhu@gmail.com', address: 'Shop 4, Juhu Beach Residency, Mumbai' }
    },
    {
      owner: { name: 'Karthik Subramanian Iyer', email: 'karthik.owner@gmail.com', address: 'Nungambakkam High Road, Chennai' },
      store: { name: 'Subway Gourmet Sandwiches', email: 'subway.chennai@gmail.com', address: 'Avenue Towers, Nungambakkam, Chennai' }
    },
    {
      owner: { name: 'Vikram Singh Shekhawat', email: 'vikram.owner@gmail.com', address: 'C-Scheme, Jaipur, Rajasthan' },
      store: { name: 'Burger King Royal Junction', email: 'bk.jaipur@gmail.com', address: 'Crystal Mall, Banipark, Jaipur' }
    },
    {
      owner: { name: 'Meera Nair Ramachandran', email: 'meera.owner@gmail.com', address: 'M.G. Road, Ernakulam, Kochi' },
      store: { name: 'McDonalds Happy Meals Outlet', email: 'mcdonalds.kochi@gmail.com', address: 'Centre Square Mall, Kochi, Kerala' }
    },
    {
      owner: { name: 'Sanjay Dutt Bajpai Trivedi', email: 'sanjay.owner@gmail.com', address: 'Hazratganj Plaza, Lucknow' },
      store: { name: 'KFC Hot and Crispy Chicken', email: 'kfc.hazratganj@gmail.com', address: '12 Hazratganj Metro Station Walkway, Lucknow' }
    },
    {
      owner: { name: 'Rahul Devendra Deshpande', email: 'rahul.owner@gmail.com', address: 'F.C. Road, Shivajinagar, Pune' },
      store: { name: 'Baskin Robbins Dessert Parlour', email: 'br.pune@gmail.com', address: 'Millennium Heights, FC Road, Pune' }
    },
    {
      owner: { name: 'Arjun Bhargava Chowdhury', email: 'arjun.owner@gmail.com', address: 'Gachibowli Financial Dist, Hyderabad' },
      store: { name: 'Star Biryani Spice Kingdom', email: 'biryani.gachibowli@gmail.com', address: 'Pillar 112, Gachibowli, Hyderabad' }
    },
    {
      owner: { name: 'Tanvi Aditi Sen Mohapatra', email: 'tanvi.owner@gmail.com', address: 'Salt Lake City Plaza, Kolkata' },
      store: { name: 'Pizza Hut Supreme Pan Pizza', email: 'pizzahut.saltlake@gmail.com', address: 'Block GP, Sector V, Salt Lake, Kolkata' }
    },
    {
      owner: { name: 'Rakesh Ramesh Chandra Verma', email: 'rakesh.owner@gmail.com', address: 'MP Nagar Zone II, Bhopal' },
      store: { name: 'Dunkin Donuts and Espresso', email: 'dunkin.bhopal@gmail.com', address: 'DB City Mall, Arera Hills, Bhopal' }
    }
  ];

  const stores = [];
  for (const item of storesData) {
    // A. Create Store Owner
    const owner = await prisma.user.create({
      data: {
        name: item.owner.name,
        email: item.owner.email,
        password: hashedPassword,
        address: item.owner.address,
        role: 'STORE_OWNER'
      }
    });

    // B. Create Store linked to Owner
    const store = await prisma.store.create({
      data: {
        name: item.store.name,
        email: item.store.email,
        address: item.store.address,
        ownerId: owner.id
      }
    });

    stores.push(store);
    console.log(`Created Store: "${store.name}" linked to Owner: ${owner.email} (ID: ${owner.id})`);
  }

  // 5. Submit ratings (between 1 and 5) from the normal users to these stores
  // Give each store a unique blend of ratings to simulate realistic average scores!
  const ratingGrid = [
    [5, 4, 5], // Store 1 -> Avg 4.7
    [4, 3, 4], // Store 2 -> Avg 3.7
    [5, 5, 5], // Store 3 -> Avg 5.0
    [2, 3, 2], // Store 4 -> Avg 2.3
    [4, 4, 5], // Store 5 -> Avg 4.3
    [1, 2, 1], // Store 6 -> Avg 1.3
    [5, 4, 4], // Store 7 -> Avg 4.3
    [5, 5, 4], // Store 8 -> Avg 4.7
    [3, 3, 4], // Store 9 -> Avg 3.3
    [4, 5, 4]  // Store 10 -> Avg 4.3
  ];

  for (let sIdx = 0; sIdx < stores.length; sIdx++) {
    const store = stores[sIdx];
    const scores = ratingGrid[sIdx];

    for (let uIdx = 0; uIdx < normalUsers.length; uIdx++) {
      const user = normalUsers[uIdx];
      const ratingScore = scores[uIdx];

      await prisma.rating.create({
        data: {
          rating: ratingScore,
          userId: user.id,
          storeId: store.id
        }
      });
    }
    console.log(`Submitted 3 ratings to "${store.name}".`);
  }

  console.log('\nDatabase seeding finished successfully!');
  console.log('\n======================================================');
  console.log('DEMO ACCOUNTS READY TO USE:');
  console.log('Password for all accounts: Password123!');
  console.log('------------------------------------------------------');
  console.log('1. System Administrator:');
  console.log('   Email: admin@gmail.com');
  console.log('2. Normal Users (Rating Submitter):');
  console.log('   Email: amit.kumar@gmail.com');
  console.log('   Email: priya.sri@gmail.com');
  console.log('   Email: sid.roy@gmail.com');
  console.log('3. Store Owners:');
  console.log('   Emails: rajesh.owner@gmail.com, ananya.owner@gmail.com, etc.');
  console.log('======================================================\n');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
