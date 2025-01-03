import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  password: string;
  watchlists: mongoose.Types.ObjectId[];
  reviews: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  watchlists: [{
    type: Schema.Types.ObjectId,
    ref: 'Watchlist'
  }],
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }]
}, {
  timestamps: true
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model<IUser>('User', UserSchema);
