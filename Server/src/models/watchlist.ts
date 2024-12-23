import mongoose, { Schema, Document } from 'mongoose';

export interface IWatchlist extends Document {
  title: string;
  genre: string;
  update_date: Date;
  movie_id: string;
  review_id: mongoose.Types.ObjectId;
}

const WatchlistSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  update_date: {
    type: Date,
    default: Date.now
  },
  movie_id: {
    type: String,
    required: true
  },
  review_id: {
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }
});

export default mongoose.model<IWatchlist>('Watchlist', WatchlistSchema);