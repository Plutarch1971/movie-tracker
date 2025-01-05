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

interface AddUserArgs {
  input: {
    username: string;
    password: string;
  };
}

interface LoginArgs {
  username: string;
  password: string;
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

    addUser: async (_parent: any, { input }: AddUserArgs) => {
      // Create a nnew user with the provieded input
      const user = await User.create({...input});

      // Sign a JWT token with the user's username and id
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

    addReview: async (_: unknown, { reviewData }: { reviewData: ReviewInput }, context: Context) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');

      const newReview = new Review({
        ...reviewData,
        user_id: context.user._id,
      });

      const user = await User.findById(context.user._id);
      if (!user) throw new AuthenticationError('User not found');
      
      user.reviews.push(newReview.id);
      await user.save();

      return await newReview.save();
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
  },
};