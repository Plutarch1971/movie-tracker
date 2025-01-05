import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StarIcon } from "lucide-react";
import axios from 'axios';
import type { Movie } from '../models/Movie';
import type { Review } from '../models/Review';
import { AddItemModal } from '../components/Watchlist/AddItemModal';
import '/src/assets/styles/movieinfo.css';

interface MovieDetails extends Movie {
  averageRating: number;
  reviews: Review[];
}

// interface UserReview {
//   rating: number;
//   comment: string;
// }

const MovieInfoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        // Fetch movie details from TMDB
        const movieResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?append_to_response=credits`,
          {
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN_SECRET}`,
              'accept': 'application/json'
            }
          }
        );
        
        const movieData = await movieResponse.json();
        
        // Fetch reviews and ratings from your database
        const reviewsResponse = await axios.get(`/api/movies/${id}/reviews`);
        
        setMovie({
          id: movieData.id,
          title: movieData.title,
          poster_path: movieData.poster_path,
          runtime: movieData.runtime,
          overview: movieData.overview,
          release_date: movieData.release_date,
          genre: movieData.genres.map((g: { name: string }) => g.name).join(', '),
          cast: movieData.credits.cast.slice(0, 5).map((c: { name: string }) => c.name).join(', '),
          averageRating: reviewsResponse.data.averageRating || 0,
          reviews: reviewsResponse.data.reviews || []
        });
        
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch movie details');
        setIsLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const handleRatingSubmit = async () => {
    if (!isLoggedIn) {
      setError('Please log in to rate movies');
      return;
    }

    try {
      await axios.post(`/api/movies/${id}/ratings`, {
        rating: userRating
      });
      // Refresh movie data to update ratings
      window.location.reload();
    } catch (err) {
      setError('Failed to submit rating');
    }
  };

  const handleReviewSubmit = async () => {
    if (!isLoggedIn) {
      setError('Please log in to review movies');
      return;
    }

    try {
      await axios.post(`/api/movies/${id}/reviews`, {
        rating: userRating,
        comment: reviewText
      },
    {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
      // Refresh movie data to update reviews
      window.location.reload();
    } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 400) {
            setError('You have already reviewed this movie');
          } else {
            setError('Failed to submit review');
          }
    }
  };

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;
  if (!movie) return <div className="flex justify-center items-center min-h-screen">Movie not found</div>;

  return (
    <div className="movie-info-container">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="movie-poster">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-auto"
              />
            </div>
            <div>
              <h1>{movie.title}</h1>
              
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <span className="font-semibold mr-2">Community Rating:</span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-5 h-5 ${
                          star <= movie.averageRating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2">({movie.reviews.length} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="movie-details">
                <div>
                  <p><span className="font-semibold">Runtime:</span> {movie.runtime} minutes</p>
                  <p><span className="font-semibold">Release Date:</span> {movie.release_date}</p>
                  <p><span className="font-semibold">Genre:</span> {movie.genre}</p>
                </div>
                <div>
                  <p><span className="font-semibold">Cast:</span> {movie.cast}</p>
                </div>
              </div>

              <p className="mb-6">{movie.overview}</p>

              {isLoggedIn && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Rate this Movie</h3>
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-6 h-6 cursor-pointer ${
                          star <= (hoveredRating || userRating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setUserRating(star)}
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleRatingSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Submit Rating
                  </button>
                </div>
              )}

              {isLoggedIn && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full h-32 p-2 border rounded mb-4"
                    placeholder="Share your thoughts about this movie..."
                  />
                  <button
                    onClick={handleReviewSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Submit Review
                  </button>
                </div>
              )}

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Reviews</h3>
                {movie.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {movie.reviews.map((review, index) => (
                      <div key={index} className="border-b pb-4">
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= (review?.rating ?? 0)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            by {review.username}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.note}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showWatchlistModal && (
        <AddItemModal
          isOpen={showWatchlistModal}
          onClose={() => setShowWatchlistModal(false)}
          movie={{
            id:parseInt(movie?.id),
            title: movie.title,
            posterURL: movie.poster_path
          }}
        />
      )}
    </div>
  );
};

export default MovieInfoPage;