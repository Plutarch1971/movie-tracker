import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { 
  User, 
  Review, 
  Watchlist,
  IUser,
  IReview,
  IWatchlist 
} from '..//models/index';
import mongoose, { ObjectId } from 'mongoose';

interface Context {
  user: IUser & { _id: ObjectId }; // Ensure _id is always present
}

interface ReviewInput {
  movie_id: string;
  note: string;
  rating: number;
}

interface WatchlistInput {
  title: string;
}

interface MovieInput {
  movie_id: string;
  watched?: boolean;
}

export const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: Context) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');
      return context.user;
    },

    getUserReviews: async (_: unknown, { userId }: { userId: string }) => {
      return Review.find({ user_id: userId }).sort({ date: -1 });
    },

    getUserWatchlists: async (_: unknown, { userId }: { userId: string }) => {
      return Watchlist.find({ user_id: userId });
    },

    getMovieReviews: async (_: unknown, { movieId }: { movieId: string }) => {
      return Review.find({ movie_id: movieId }).sort({ date: -1 });
    },

    getMovieRating: async (_: unknown, { movieId }: { movieId: string }) => {
      return Review.getMovieAverageRating(movieId);
    },
  },

  Mutation: {
    addReview: async (_: unknown, { reviewData }: { reviewData: ReviewInput }, context: Context) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');

      const newReview = new Review({
        ...reviewData,
        user_id: context.user._id,
      });

      const user = await User.findById(context.user._id);
      if (!user) throw new UserInputError('User not found');
      
      user.reviews.push(newReview.id);
      await user.save();

      return await newReview.save();
    },

    removeReview: async (_: unknown, { reviewId }: { reviewId: string }, context: Context) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');

      const review = await Review.findById(reviewId);
      if (!review) throw new UserInputError('Review not found');
      
      if (review.user_id.toString() !== context.user._id.toString()) {
        throw new AuthenticationError('Not authorized to delete this review');
      }

      await User.findByIdAndUpdate(context.user._id, {
        $pull: { reviews: new mongoose.Types.ObjectId(reviewId) }
      });

      await Review.findByIdAndDelete(reviewId);
      return true;
    },

    createWatchlist: async (_: unknown, { watchlistData }: { watchlistData: WatchlistInput }, context: Context) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');

      const newWatchlist = new Watchlist({
        ...watchlistData,
        user_id: context.user._id,
        movies: []
      });

      const user = await User.findById(context.user._id);
      if (!user) throw new UserInputError('User not found');

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
      if (!watchlist) throw new UserInputError('Watchlist not found');

      if (watchlist.user_id.toString() !== context.user._id.toString()) {
        throw new AuthenticationError('Not authorized to modify this watchlist');
      }

      const movieExists = watchlist.movies.some(m => m.movie_id === movieData.movie_id);
      if (movieExists) throw new UserInputError('Movie already in watchlist');

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
  },
};