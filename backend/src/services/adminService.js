const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");



// Dashboard Stats
exports.getDashboardStats = async () => {

  const totalUsers =
    await prisma.user.count();

  const totalStores =
    await prisma.store.count();

  const totalRatings =
    await prisma.rating.count();

  return {
    totalUsers,
    totalStores,
    totalRatings
  };
};



// Create User
exports.createUser = async ({
  name,
  email,
  password,
  address,
  role
}) => {

  const existingUser =
    await prisma.user.findUnique({
      where: { email }
    });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const user =
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role
      }
    });

  return user;
};




// Create Store
exports.createStore = async ({
  name,
  email,
  address,
  ownerId
}) => {

  const owner =
    await prisma.user.findUnique({
      where: {
        id: ownerId
      }
    });

  if (!owner) {
    throw new Error(
      "Store owner not found"
    );
  }

  const store =
    await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId
      }
    });

  return store;
};




// Get All Users
exports.getAllUsers = async ({
  search = "",
  name = "",
  email = "",
  address = "",
  role = "",
  sort = "name",
  order = "asc"
}) => {
  const where = {};

  // If a role filter is specified
  if (role) {
    where.role = role;
  }

  const conditions = [];

  // Global search across Name, Email, Address
  if (search) {
    conditions.push({
      OR: [
        { name: { contains: search } },
        { email: { contains: search } },
        { address: { contains: search } }
      ]
    });
  }

  // Specific column-based filters
  if (name) {
    conditions.push({ name: { contains: name } });
  }
  if (email) {
    conditions.push({ email: { contains: email } });
  }
  if (address) {
    conditions.push({ address: { contains: address } });
  }

  if (conditions.length > 0) {
    where.AND = conditions;
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: {
      [sort]: order
    },
    include: {
      stores: {
        include: {
          ratings: true
        }
      }
    }
  });

  return users.map(user => {
    let averageRating = null;

    if (user.role === "STORE_OWNER") {
      const allRatings = user.stores.flatMap(s => s.ratings);
      if (allRatings.length > 0) {
        averageRating = parseFloat(
          (allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length).toFixed(1)
        );
      } else {
        averageRating = 0.0;
      }
    }

    const { password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      averageRating
    };
  });
};




// Get All Stores
exports.getAllStores = async ({
  search = "",
  sort = "name",
  order = "asc"
}) => {
  const stores = await prisma.store.findMany({
    where: {
      OR: [
        {
          name: {
            contains: search
          }
        },
        {
          address: {
            contains: search
          }
        }
      ]
    },
    include: {
      ratings: true
    },
    // If sorting by a computed field, do not apply orderBy in MySQL to avoid crash
    ...(sort !== "averageRating" ? { orderBy: { [sort]: order } } : {})
  });

  const mappedStores = stores.map(store => {
    const avgRating =
      store.ratings.length > 0
        ? parseFloat((
            store.ratings.reduce((a, b) => a + b.rating, 0) / store.ratings.length
          ).toFixed(1))
        : 0;

    return {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      createdAt: store.createdAt,
      ownerId: store.ownerId,
      averageRating: avgRating
    };
  });

  if (sort === "averageRating") {
    mappedStores.sort((a, b) => {
      if (order === "asc") {
        return a.averageRating - b.averageRating;
      } else {
        return b.averageRating - a.averageRating;
      }
    });
  }

  return mappedStores;
};