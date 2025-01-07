import { signToken, AuthenticationError } from '../Service/auth.js'
import {
  User, 
  Review, 
  Watchlist,
  IUser,
  IReview,
  IWatchlist 
} from '../models/index.js';
import mongoose, { ObjectId } from 'mongoose';

interface Context {
  user: IUser & { _id: ObjectId }; // Ensure _id is always present
}

// interface AddUserArgs {
//   input: {
//     username: string;
//     password: string;
//   };
// }

interface LoginArgs {
  username: string;
  password: string;
}


interface WatchlistInput {
  title: string;
}

interface MovieInput {
  movie_id: string;
  watched?: boolean;
}

interface ReviewInput {
  movie_id: string;
  note: string;
  rating: number;
}

export const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: Context) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');
      return User.findById(context.user._id)
        .populate('reviews')
        .populate('watchlists');
    },

    getUserReviews: async (_: unknown, { userId }: { userId: string }) => {
      return Review.find({ user_id: userId }).sort({ date: -1 });
    },

    getUserWatchlists: async (_: unknown, { userId }: { userId: string }) => {
      return Watchlist.find({ user_id: userId });
    },

    getMovieReviews: async (_: unknown, { movieId }: { movieId: string }) => {
      return Review.find({ movie_id: movieId })
        .sort({ date: -1 })
        .populate('user');
    },

    getMovieRating: async (_: unknown, { movieId }: { movieId: string }) => {
      const reviews = await Review.find({ movie_id: movieId });
      const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
      return {
        averageRating: reviews.length ? totalRatings / reviews.length : 0,
        numberOfReviews: reviews.length
      };
    },

      
      getTopRatedMovies: async (_: unknown, { limit = 10 }: { limit?: number }) => {
        try {
          const reviews = await Review.aggregate([
            {
              $match: {
                rating: { $exists: true, $ne: null }  // Only include reviews with ratings
              }
            },
            {
              $group: {
                _id: '$movie_id',
                averageRating: { $avg: '$rating' },
                numberOfReviews: { $sum: 1 }
              }
            },
            {
              $match: {
                numberOfReviews: { $gte: 3 }
              }
            },
            {
              $sort: { averageRating: -1 }
            },
            {
              $limit: limit
            }
          ]);
  
          return reviews.map(review => ({
            movie_id: review._id,
            averageRating: parseFloat(review.averageRating.toFixed(1)),
            numberOfReviews: review.numberOfReviews
          }));
        } catch (error) {
          console.error('Error in getTopRatedMovies:', error);
          throw new Error('Failed to fetch top rated movies');
        }
      },
  
      getRecentReviews: async (_: unknown, { limit = 10 }: { limit?: number }) => {
        try {
          const reviews = await Review.find()
            .sort({ date: -1 })
            .limit(limit)
            .populate({
              path: 'user_id',
              model: 'User',
              select: '_id username'
            });
  
          // Transform the reviews to match the expected format
          return reviews.map(review => ({
            _id: review._id,
            user_id: review.user_id._id,
            movie_id: review.movie_id,
            date: review.date.toISOString(),
            note: review.note,
            rating: review.rating || 0,
            user: review.user_id // This will be the populated user data
          }));
        } catch (error) {
          console.error('Error in getRecentReviews:', error);
          throw new Error('Failed to fetch recent reviews');
        }
      },
  
      getMostReviewedMovies: async (_: unknown, { limit = 10 }: { limit?: number }) => {
        try {
          const reviews = await Review.aggregate([
            {
              $match: {
                rating: { $exists: true, $ne: null }
              }
            },
            {
              $group: {
                _id: '$movie_id',
                averageRating: { $avg: '$rating' },
                numberOfReviews: { $sum: 1 }
              }
            },
            {
              $sort: { numberOfReviews: -1 }
            },
            {
              $limit: limit
            }
          ]);
  
          return reviews.map(review => ({
            movie_id: review._id,
            averageRating: parseFloat(review.averageRating.toFixed(1)),
            numberOfReviews: review.numberOfReviews
          }));
        } catch (error) {
          console.error('Error in getMostReviewedMovies:', error);
          throw new Error('Failed to fetch most reviewed movies');
        }
      },
  },
    


  Mutation: {

    // addUser: async (_parent: any,  input : any) => {
    //   // Create a nnew user with the provieded input

    //   const { password, username} = input;
    //   const user = await User.create({password:password, username:username});

    //   // Sign a JWT token with the user's username and id
    //   const token = signToken(user.username, user._id);
    //   console.log("Token:", token);
    //   return { token, user };
    // },
    addUser: async (_parent: any, { username, password }: { username: string, password: string }) => {
      const user = await User.create({ username, password });
      const token = signToken(user.username, user._id);
      return { token, user };
    },

    login: async (_parent: any, { username, password }: LoginArgs) => {
      const user = await User.findOne({ username });

      if (!user) throw new AuthenticationError('Incorrect username');

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) throw new AuthenticationError('Incorrect password');

      const token = signToken(user.username, user._id);

      return { token, user };
    },

    addReview: async (_parent: any, { reviewData }: { reviewData: ReviewInput }, context: Context) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');
    
      const review = await Review.create({
        ...reviewData,
        user_id: context.user._id,
        date: new Date().toISOString()
      });
    
      await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { reviews: review._id } }
      );
    
      return await Review.findById(review._id).populate('user');
    },

    removeReview: async (_: unknown, { reviewId }: { reviewId: string }, context: Context) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');

      const review = await Review.findById(reviewId);
      if (!review) throw new AuthenticationError('Review not found');
      
      if (review.user_id.toString() !== context.user._id.toString()) {
        throw new AuthenticationError('Not authorized to delete this review');
      }

      await User.findByIdAndUpdate(context.user._id, {
        $pull: { reviews: new mongoose.Types.ObjectId(reviewId) }
      });

      await Review.findByIdAndDelete(reviewId);
      return true;
    },

    updateReviewRating: async (_: unknown, 
      { reviewId, rating }: { reviewId: string; rating: number }, 
      context: Context
    ) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');

      const review = await Review.findById(reviewId);
      if (!review) throw new AuthenticationError('Review not found');

      if (review.user_id.toString() !== context.user._id.toString()) {
        throw new AuthenticationError('Not authorized to modify this review');
      }

      review.rating = rating;
      await review.save();
      return review;
    },

    createWatchlist: async (_: unknown, { watchlistData }: { watchlistData: WatchlistInput }, context: Context) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');

      const newWatchlist = new Watchlist({
        ...watchlistData,
        user_id: context.user._id,
        movies: []
      });

      const user = await User.findById(context.user._id);
      if (!user) throw new AuthenticationError('User not found');

      user.watchlists.push(newWatchlist.id);
      await user.save();

      return await newWatchlist.save();
    },

    addMovieToWatchlist: async (_: unknown, 
      { watchlistId, movieData }: { watchlistId: string; movieData: MovieInput }, 
      context: Context
    ) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');

      const watchlist = await Watchlist.findById(watchlistId);
      if (!watchlist) throw new AuthenticationError('Watchlist not found');

      if (watchlist.user_id.toString() !== context.user._id.toString()) {
        throw new AuthenticationError('Not authorized to modify this watchlist');
      }

      const movieExists = watchlist.movies.some(m => m.movie_id === movieData.movie_id);
      if (movieExists) throw new AuthenticationError('Movie already in watchlist');

      watchlist.movies.push({
        ...movieData,
        added_date: new Date(),
        watched: movieData.watched || false
      });

      return await watchlist.save();
    },
  },

  // Field Resolvers
  Review: {
    user: async (parent: IReview) => {
      return User.findById(parent.user_id);
    }
  },

  Watchlist: {
    user: async (parent: IWatchlist) => {
      return User.findById(parent.user_id);
    }
  }
}