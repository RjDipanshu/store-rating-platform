const prisma = require("../config/prisma");



exports.getOwnerDashboard =
  async (ownerId) => {

    // Find owner's store
    const store =
      await prisma.store.findFirst({

        where: {
          ownerId
        },

        include: {
          ratings: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }

      });

    if (!store) {
      throw new Error(
        "Store not found"
      );
    }

    // Average Rating
    const averageRating =
      store.ratings.length > 0
        ? (
            store.ratings.reduce(
              (sum, item) =>
                sum + item.rating,
              0
            ) / store.ratings.length
          ).toFixed(1)
        : 0;

    return {

      storeId: store.id,

      storeName: store.name,

      averageRating,

      totalRatings:
        store.ratings.length,

      usersWhoRated:
        store.ratings.map(rating => ({
          userId:
            rating.user.id,

          name:
            rating.user.name,

          email:
            rating.user.email,

          rating:
            rating.rating
        }))

    };
};