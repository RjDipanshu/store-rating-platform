const prisma = require("../config/prisma");



// Get Stores
exports.getStores = async (
  query,
  userId
) => {

  const {
    search = "",
    sort = "name",
    order = "asc"
  } = query;

  const stores =
    await prisma.store.findMany({

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

      ...(sort !== "averageRating" ? { orderBy: { [sort]: order } } : {})

    });

  const mappedStores = stores.map(store => {

    const averageRating =
      store.ratings.length > 0
        ? parseFloat(
            (
              store.ratings.reduce(
                (sum, item) =>
                  sum + item.rating,
                0
              ) / store.ratings.length
            ).toFixed(1)
          )
        : 0.0;

    const userRating =
      store.ratings.find(
        r => r.userId === userId
      );

    return {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      averageRating,
      userSubmittedRating:
        userRating?.rating || null
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




// Submit or Update Rating
exports.submitStoreRating =
  async ({
    userId,
    storeId,
    rating
  }) => {

    if (
      rating < 1 ||
      rating > 5
    ) {
      throw new Error(
        "Rating must be between 1 and 5"
      );
    }

    const existingRating =
      await prisma.rating.findFirst({
        where: {
          userId,
          storeId
        }
      });

    if (existingRating) {

      return prisma.rating.update({

        where: {
          id: existingRating.id
        },

        data: {
          rating
        }

      });
    }

    return prisma.rating.create({

      data: {
        rating,
        userId,
        storeId
      }

    });
  };