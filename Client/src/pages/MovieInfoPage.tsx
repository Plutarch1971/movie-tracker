import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { StarIcon } from "lucide-react";
import axios from 'axios';
import type { Movie } from '../models/Movie';
import type { Review } from '../models/Review';
import { AddItemModal } from '../components/Watchlist/AddItemModal';
import '/src/assets/styles/movieinfo.css';
import { ADD_REVIEW, } from '../graphql/mutations';
import { useMutation, useQuery } from '@apollo/client';
import { QUERY_REVIEWS, GET_MOVIE_RATING, } from '../graphql/queries';
import Auth from '../utils/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/movieinfo.css';

interface MovieDetails extends Movie {
  averageRating: number;
  reviews: Review[];
}


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
  const { data: reviewsData, loading: reviewsLoading } = useQuery(QUERY_REVIEWS, {
    variables: { movieId: id },
    skip: !id
  });

  const { data: ratingData, loading: ratingLoading } = useQuery(GET_MOVIE_RATING, {
    variables: { movieId: id },
    skip: !id
  });


  const [review] = useMutation(ADD_REVIEW, {
    refetchQueries: [
      {
        query:
          QUERY_REVIEWS,
        variables: { movieId: id }
      },
      {
        query:
          GET_MOVIE_RATING,
        variables: { movieId: id }
      },

    ]
  });

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

    const token = localStorage.getItem('id_token');
    setIsLoggedIn(!!token);

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);
  

  const handleReviewSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!Auth.loggedIn()) {
      setError('Please log in to review movies');
      return;
    }

    try {
      await review({
        variables: {
          reviewData: {
            movie_id: id,
            note: reviewText,
            rating: userRating
          }
        }
      });
      setReviewText('');
      setUserRating(0);
      setError(null);
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      console.error('Error submitting review:', err);
    }
  };


  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;
  if (!movie || reviewsLoading || ratingLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  const averageRating = ratingData?.getMovieRating?.averageRating || 0;
  const numberOfReviews = ratingData?.getMovieRating?.numberOfReviews || 0;
  const reviews = reviewsData?.getMovieReviews || [];

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container movie-info-container-bg">
        <div className="row">
          {/* Left column for movie poster */}
          <div className="col-md-4 mt-4">
            <div className="card border-0 shadow">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="card-img-top"
              />
            </div>
            </div>
            {/* Right column for Movie Details */}
            <div className="col-md-8 mt-4">
              <div className="card border-0 shadow">
                <div className="card-body p-2 movie-info-container-bg">
                  {/* Movie title row */}
                  <div className="row mb-4">
                    <div className="col-12">
                      <h1 className="display-1">{movie.title}</h1>
                    </div>
                  </div>
                </div> 
             </div>
              {/* Rating Row */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="d-flex align-items-center">
                    <span className="fw-bold me-2 p-3">Community Rating:</span>
                    <div className="d-flex align-items-center">
                      {[1, 2, 3, 4, 5,].map((star) => (
                        <StarIcon
                          key={star}
                          className={`${star <= averageRating
                              ? 'text-warning'
                              : 'text-secondary'
                            }`}
                        />

                      ))}
                      <span className="ms-2">({numberOfReviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Watchlist Button Row */}
              {isLoggedIn && (
                <div className="row mb-4">
                  <div className="col-12">
                    <button
                      onClick={() => setShowWatchlistModal(true)}
                      className="btn btn-secondary text-white px-4 py-2 rounded hover:bg-indigo-700 mb-4">
                      Add to Watchlist
                    </button>
                  </div>
                </div>
              )}
              {/* Movie Details Row */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <p><span className="fw-bold">Runtime:</span> {movie.runtime} minutes</p>
                  <p><span className="fw-fold">Release Date:</span> {movie.release_date}</p>
                  <p><span className="fw-bold">Genre:</span> {movie.genre}</p>
                </div>
                <div className="col-md-6">
                  <p><span className="fw-bold">Cast:</span> {movie.cast}</p>
                </div>
              </div>

              {/* Overviw Row */}
              <div className="row-mb-4">
                <div className="col-12">
                  <p className="lead">{movie.overview}</p>
                </div>
              </div>

              {/* Rating Section */}
              {isLoggedIn && (
                <div className="row mb-2 d-flex align-items-center">
                  <div className="col-6">
                    <h3 className="h4 mb-2">Rate this Movie</h3>
                  </div>
                    <div className="col-6 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`cursor-pointer ${star <= (hoveredRating || userRating)
                              ? 'text-warning'
                              : 'text-secondary'
                            }`}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => setUserRating(star)}
                        />
                      ))}
                    </div>
                  </div>
              )}

              {/* Review Form */}
              {isLoggedIn && (
                <div className="row mb-8">
                  <div className="col-12">
                    <h3 className="h4 mb-3">Write a Review</h3>
                    <div className="form-group mb-3">
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="form-control"
                        rows={4}
                        placeholder="Share your thoughts about this movie..."
                      />
                    </div>
                    <button
                      onClick={handleReviewSubmit}
                      className="btn btn-secondary text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              <div className="row">
                <div className="col-12">
                  <h3 className="h4 mb-3">Reviews</h3>
                  {reviews.length > 0 ? (
                    <div className="list-group">
                      {reviews.map((reviews: {
                        _id: string;
                        rating: number;
                        note: string;
                        user: { username: string }
                      }) => (
                        <div key={reviews._id} className="list-group-item">
                          <div className="d-flex items-center mb-2">
                            <div className="flex align-items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <StarIcon
                                  key={star}
                                  className={`w-4 h-4 ${star <= reviews.rating
                                      ? 'text-warning'
                                      : 'text-secondary'
                                    }`}
                                />
                              ))}
                            </div>
                            <span className="ms-2 text-muted">
                              by {reviews.user.username}
                            </span>
                          </div>
                          <p className="mb-0 text-gray-700">{reviews.note}</p>
                        </div>
                      ))}

                    </div>
                  ) : (
                    <p className="text-muted">No reviews yet. Be the first to review!</p>
                  )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        
    
    {/*Watchlist Modal*/}
          {showWatchlistModal && movie && (
            <Suspense fallback={<div>Loading...</div>}>
            <AddItemModal
              isOpen={showWatchlistModal}
              onClose={() => setShowWatchlistModal(false)}
              movie={{
                id: Number(movie.id),
                title: movie.title,
                posterURL: movie.poster_path
              }}
            />
            </Suspense>
          )}
        </div>
        );      
};

export default MovieInfoPage;