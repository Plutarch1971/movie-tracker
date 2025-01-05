import { Router, Request, Response } from 'express';
import  Review from '../models/Review';
import { authenticateToken } from '../Service/auth';


interface MovieAggregation {
    _id: string;
    averageRating: number;
    totalReviews: number;
    lastReviewDate: Date;
  }
  
  // Get top rated movies
const router = Router();
router.get('/top-rated', async (_req: Request, res: Response) => {
    try {
      const topRated: MovieAggregation[] = await Review.aggregate([
        {
          $group: {
            _id: '$movie_id',
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 }
          }
        },
        { $sort: { averageRating: -1 } },
        { $limit: 5 }
      ]);
      res.json(topRated);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch top rated movies' });
    }
  });

    // Get recently reviewed movies
    router.get('/recent-reviews', async (_req: Request, res: Response) => {
        try {
          const recentReviews = await Review.aggregate([
            { $sort: { date: -1 } },
            {
              $group: {
                _id: '$movie_id',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 },
                lastReviewDate: { $first: '$date' }
              }
            },
            { $sort: { lastReviewDate: -1 } },
            { $limit: 5 }
          ]);
          res.json(recentReviews);
        } catch (error) {
          res.status(500).json({ error: 'Failed to fetch recent reviews' });
        }
      });

      // Get most reviewed movies
      router.get('/most-reviewed', async (_req: Request, res: Response) => {
        try {
          const mostReviewed = await Review.aggregate([
            {
              $group: {
                _id: '$movie_id',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
              }
            },
            { $sort: { totalReviews: -1 } },
            { $limit: 5 }
          ]);
          res.json(mostReviewed);
        } catch (error) {
          res.status(500).json({ error: 'Failed to fetch most reviewed movies' });
        }
      });

      router.get('/:movieId/reviews', async (req: Request, res: Response) => {
        try {
          const movieId = req.params.movieId;
          const reviews = await Review.find({ movie_id: movieId })
            .sort({ date: -1 })
            .populate('user_id', 'username'); // Assuming you want to include username
      
          // Calculate average rating
          const aggregation = await Review.aggregate([
            { $match: { movie_id: movieId } },
            {
              $group: {
                _id: '$movie_id',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
              }
            }
          ]);
      
          const response = {
            reviews,
            averageRating: aggregation[0]?.averageRating || 0,
            totalReviews: aggregation[0]?.totalReviews || 0
          };
      
          res.json(response);
        } catch (error) {
          res.status(500).json({ error: 'Failed to fetch movie reviews' });
        }
      });
      
      // Add a new review
      router.post('/:movieId/reviews', authenticateToken, async (req: Request, res: Response) => {
        try {
          const { rating, note } = req.body;
          const movieId = req.params.movieId;
          if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
          }
          const userId = req.user.id; // Assuming auth middleware adds user to request
      
          // Check if user has already reviewed this movie
          const existingReview = await Review.findOne({
            movie_id: movieId,
            user_id: userId
          });
      
          if (existingReview) {
            return res.status(400).json({ error: 'You have already reviewed this movie' });
          }
      
          const newReview = new Review({
            movie_id: movieId,
            user_id: userId,
            rating,
            note,
            date: new Date()
          });
      
          await newReview.save();
          res.status(201).json(newReview);
          return newReview;
        } catch (error) {
          return (res.status(500).json({ error: 'Failed to add review' }));
        }
      });
      
      // Update a review
      router.put('/:movieId/reviews/:reviewId', authenticateToken, async (req: Request, res: Response) => {
        try {
          const { rating, comment } = req.body;
          const { reviewId } = req.params;
          if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
          }
          const userId = req.user.id;
      
          const review = await Review.findOne({
            _id: reviewId,
            user_id: userId
          });
      
          if (!review) {
            return res.status(404).json({ error: 'Review not found or unauthorized' });
          }
      
          review.rating = rating;
          review.note = comment;
          review.date = new Date();
      
          await review.save();
          res.json(review);
          return review
        } catch (error) {
          return ({error: 'Failed to update review'});
        }
      });
      
      // Delete a review
      router.delete('/:movieId/reviews/:reviewId', authenticateToken, async (req: Request, res: Response) => {
        try {
          const { reviewId } = req.params;
          if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
          }
          const userId = req.user.id;
      
          const result = await Review.deleteOne({
            _id: reviewId,
            user_id: userId
          });
      
          if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Review not found or unauthorized' });
          }
      
          res.json({ message: 'Review deleted successfully' });
          return (res.json({ message: 'Review deleted successfully' }))
        } catch (error) {
          return (res.status(500).json({ error: 'Failed to delete review' }));
        }
      });
      
      export default router;