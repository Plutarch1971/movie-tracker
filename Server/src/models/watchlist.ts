import mongoose, { Schema, Document } from 'mongoose';

export interface IWatchlist extends Document {
  user_id: mongoose.Types.ObjectId;
  title: string;
  movies: {
    movie_id: string;
    added_date: Date;
    watched: boolean;
  }[];
}

const WatchlistSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  movies: [{
    movie_id: {
      type: String,
      required: true
    },
    added_date: {
      type: Date,
      default: Date.now
    },
    watched: {
      type: Boolean,
      default: false
    }
  }]
});

export default mongoose.model<IWatchlist>('Watchlist', WatchlistSchema);