import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  user_id: mongoose.Types.ObjectId;
  movie_id: string;
  date: Date;
  note: string;
  rating: number;
}

// Add interface for static methods
interface IReviewModel extends Model<IReview> {
  getMovieAverageRating(movieId: string): Promise<number>;
}

const ReviewSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movie_id: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: false
  }
});

// ReviewSchema.statics.getMovieAverageRating = async function(movieId: string): Promise<number> {
//   const result = await this.aggregate([
//     { $match: { movie_id: movieId } },
//     { 
//       $group: { 
//         _id: null, 
//         averageRating: { $avg: '$rating' }, 
//         numberOfReviews: { $sum: 1 } 
//       } 
//     }
//   ]);
//   return result[0]?.averageRating || 0;
// };

// ReviewSchema.index({ user_id: 1, movie_id: 1 }, { unique: true });
ReviewSchema.virtual('user', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true
});

ReviewSchema.statics.getMovieAverageRating = async function(movieId: string): Promise<number> {
  const result = await this.aggregate([
    { $match: { movie_id: movieId } },
    { 
      $group: { 
        _id: null, 
        averageRating: { $avg: '$rating' }, 
        numberOfReviews: { $sum: 1 } 
      } 
    }
  ]);
  return result[0]?.averageRating || 0;
};


ReviewSchema.index({ user_id: 1, movie_id: 1 }, { unique: true });

export default mongoose.model<IReview, IReviewModel>('Review', ReviewSchema);