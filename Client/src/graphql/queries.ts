import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me {
   me {
        _id
        username
        watchlist {
        _id
        title
        movies {
        movie_id 
        added_date
        watched
        }
      }
      reviews {
      _id
      movie_id
      date
      note
      rating
      }
    }
  }
`;
export const QUERY_REVIEWS = gql`
  query getMovieReviews($movieId: String!) {
    getMovieReviews(movieId: $movieId) {
      _id
      movie_id
      date
      note
      rating
      user {
        _id
        username
      }
    }
  }
`;
export const GET_MOVIE_RATING = gql`
  query getMovieRating($movieId: String!) {
    getMovieRating(movieId: $movieId) {
      averageRating
      numberOfReviews
    }
  }
    
`;

export const GET_TOP_RATED_MOVIES = gql`
  query GetTopRatedMovies($limit: Int!) {
    getTopRatedMovies(limit: $limit) {
      movie_id
      averageRating
      numberOfReviews
    }
  }
`;

export const GET_RECENT_REVIEWS = gql`
  query GetRecentReviews($limit: Int!) {
    getRecentReviews(limit: $limit) {
      _id
      movie_id
      date
      note
      rating
      user {
        _id
        username
      }
    }
  }
`;

export const GET_MOST_REVIEWED_MOVIES = gql`
  query GetMostReviewedMovies($limit: Int!) {
    getMostReviewedMovies(limit: $limit) {
      movie_id
      averageRating
      numberOfReviews
    }
  }
`;
