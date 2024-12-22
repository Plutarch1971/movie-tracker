import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  date: Date;
  note: string;
}

const ReviewSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    required: true
  }
});

export default mongoose.model<IReview>('Review', ReviewSchema);