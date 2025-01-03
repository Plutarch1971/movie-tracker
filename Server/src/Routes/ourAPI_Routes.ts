import { Router, Request, Response } from 'express';
import  Review from '../models/Review';

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