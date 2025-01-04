import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StarIcon } from "lucide-react";
import type { Movie } from '../models/Movie';

interface MovieWithRatings extends Movie {
  averageRating: number;
  totalReviews: number;
  lastReviewDate?: Date;
}

interface RatingStarsProps {
  rating: number;
}

interface MovieCardProps {
  movie: MovieWithRatings;
}

const HomePage: React.FC = () => {
  const [topRatedMovies, setTopRatedMovies] = useState<MovieWithRatings[]>([]);
  const [recentlyReviewed, setRecentlyReviewed] = useState<MovieWithRatings[]>([]);
  const [mostReviewed, setMostReviewed] = useState<MovieWithRatings[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCommunityData = async (): Promise<void> => {
      try {
        const [topRatedResponse, recentResponse, popularResponse] = await Promise.all([
          axios.get<MovieWithRatings[]>('/api/movies/top-rated'),
          axios.get<MovieWithRatings[]>('/api/movies/recent-reviews'),
          axios.get<MovieWithRatings[]>('/api/movies/most-reviewed')
        ]);

        setTopRatedMovies(topRatedResponse.data.slice(0, 5));
        setRecentlyReviewed(recentResponse.data.slice(0, 5));
        setMostReviewed(popularResponse.data.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching community data:', error);
        setLoading(false);
      }
    };



    fetchCommunityData();
  }, []);


  const RatingStars: React.FC<RatingStarsProps> = ({ rating }) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <StarIcon
          key={index}
          className={`w-4 h-4 ${
            index < Math.round(rating)
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );


    // function filterSearch(event: any){
    //     const filteredMoviesData = dummyMovies.filter(movie => movie.original_title);
    //     setDummyMoviesData(filteredMoviesData);
    //}

  const MovieCard: React.FC<MovieCardProps> = ({ movie }) => (
    <div className="w-64 h-96 overflow-hidden">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-72 object-cover"
      />
      <p className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2">{movie.title}</h3>
        <div className="mt-2">
          <RatingStars rating={movie.averageRating} />
          <p className="text-sm text-gray-500 mt-1">
            {movie.totalReviews} {movie.totalReviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>
      </p>
    </div>
  );

  if (loading) {

    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Movie Tracker</h1>
          <p className="text-xl mb-8">
            Join our community of movie enthusiasts to discover, review, and track your favorite films
          </p>
        </div>
      </div>

      {/* Top Rated Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Highest Rated</h2>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {topRatedMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Most Reviewed Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Most Reviewed</h2>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {mostReviewed.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Recently Reviewed Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Recently Reviewed</h2>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {recentlyReviewed.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;