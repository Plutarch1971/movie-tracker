import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { StarIcon } from "lucide-react";
import { GET_TOP_RATED_MOVIES, GET_RECENT_REVIEWS, GET_MOST_REVIEWED_MOVIES } from '../graphql/queries';
import '../assets/styles/homepage.css'

interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string;
}

interface TopRatedMovie {
  movie_id: string;
  averageRating: number;
  numberOfReviews: number;
}

interface Review {
  _id: string;
  movie_id: string;
  date: string;
  note: string;
  rating: number;
  user: {
    _id: string;
    username: string;
  };
}


const HomePage: React.FC = () => {
  const [movieDetails, setMovieDetails] = useState<Record<string, TMDBMovie>>({});

  const { data: topRatedData, loading: topRatedLoading, error: topRatedError } = 
    useQuery<{ getTopRatedMovies: TopRatedMovie[] }>(
      GET_TOP_RATED_MOVIES,
      { 
        variables: { limit: 10 },
        notifyOnNetworkStatusChange: true,
        errorPolicy: 'all'
      }
    );

  const { data: recentReviewsData, loading: recentReviewsLoading, error: recentReviewsError } = 
    useQuery<{ getRecentReviews: Review[] }>(
      GET_RECENT_REVIEWS,
      { 
        variables: { limit: 10 },
        notifyOnNetworkStatusChange: true,
        errorPolicy: 'all'
      }
    );

  const { data: mostReviewedData, loading: mostReviewedLoading, error: mostReviewedError } = 
    useQuery<{ getMostReviewedMovies: TopRatedMovie[] }>(
      GET_MOST_REVIEWED_MOVIES,
      { 
        variables: { limit: 10 },
        notifyOnNetworkStatusChange: true,
        errorPolicy: 'all'
      }
    );

  useEffect(() => {
    const fetchMovieDetails = async (movieIds: string[]) => {
      const uniqueIds = [...new Set(movieIds)];
      const details: Record<string, TMDBMovie> = {};

      await Promise.all(
        uniqueIds.map(async (movieId) => {
          try {
            const response = await fetch(
              `https://api.themoviedb.org/3/movie/${movieId}`,
              {
                headers: {
                  'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN_SECRET}`,
                  'accept': 'application/json'
                }
              }
            );
            const data = await response.json();
            details[movieId] = data;
          } catch (err) {
            console.error(`Error fetching details for movie ${movieId}:`, err);
          }
        })
      );

      setMovieDetails(details);
    };

    const allMovieIds = [
      ...(topRatedData?.getTopRatedMovies?.map(m => m.movie_id) || []),
      ...(recentReviewsData?.getRecentReviews?.map(r => r.movie_id) || []),
      ...(mostReviewedData?.getMostReviewedMovies?.map(m => m.movie_id) || [])
    ];

    if (allMovieIds.length > 0) {
      fetchMovieDetails(allMovieIds);
    }
  }, [topRatedData, recentReviewsData, mostReviewedData]);

  const RatedMovieSection: React.FC<{ 
    title: string; 
    movies?: TopRatedMovie[];
  }> = ({ title, movies = [] }) => (
    <section className="movie-box-container">
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="MostReviewed">
          {movies?.map(movie => {
            const tmdbDetails = movieDetails[movie.movie_id];
            if (!tmdbDetails) return null;
  
            return (
              <div key={movie.movie_id} className="movie-item-container MovieCard">
                <img
                  src={`https://image.tmdb.org/t/p/w500${tmdbDetails.poster_path}`}
                  alt={tmdbDetails.title}
                  className="w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-2">{tmdbDetails.title}</h3>
                  <div className="mt-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, index) => (
                        <StarIcon
                          key={index}
                          className={`w-4 h-4 ${
                            index < Math.round(movie.averageRating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {movie.averageRating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {movie.numberOfReviews} {movie.numberOfReviews === 1 ? 'review' : 'reviews'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
  
  const ReviewSection: React.FC<{
    title: string;
    reviews?: Review[];
  }> = ({ title, reviews = [] }) => (
    <section className="movie-box-container">
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="RecentReviews">
          {reviews?.map(review => {
            const tmdbDetails = movieDetails[review.movie_id];
            if (!tmdbDetails) return null;
  
            return (
              <div key={review._id} className="movie-item-container MovieCard">
                <img
                  src={`https://image.tmdb.org/t/p/w500${tmdbDetails.poster_path}`}
                  alt={tmdbDetails.title}
                  className="w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-2">{tmdbDetails.title}</h3>
                  <div className="mt-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, index) => (
                        <StarIcon
                          key={index}
                          className={`w-4 h-4 ${
                            index < Math.round(review.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Reviewed by {review.user.username}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
  
  if (topRatedError || recentReviewsError || mostReviewedError) {
    console.error('GraphQL Errors:', { topRatedError, recentReviewsError, mostReviewedError });
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading movie data. Please try again later.</p>
      </div>
    );
  }


  if (topRatedLoading || recentReviewsLoading || mostReviewedLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="homepage-container min-h-screen bg-gray-50">
    <div className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="homepage-header mb-4">Movie Tracker</h1>
        <p className="text-xl mb-8">
          Join our community of movie enthusiasts to discover, review, and track your favorite films
        </p>
      </div>
    </div>

    <div className="overflow-y-auto"> {/* Add vertical scroll container */}
      <div className="row-container">
        <RatedMovieSection 
          title="Highest Rated" 
          movies={topRatedData?.getTopRatedMovies} 
        />
      </div>

      <div className="row-container">
        <RatedMovieSection 
          title="Most Reviewed" 
          movies={mostReviewedData?.getMostReviewedMovies} 
        />
      </div>

      <div className="row-container">
        <ReviewSection 
          title="Recently Reviewed" 
          reviews={recentReviewsData?.getRecentReviews} 
        />
      </div>
    </div>
  </div>
);
};

export default HomePage;