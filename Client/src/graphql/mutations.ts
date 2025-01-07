import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
mutation login($username:String!, $password: String!) {
    login(username:$username, password: $password){
        token
         user {
        _id
        }
     }
   }
`;

export const ADD_USER = gql`
mutation addUser($username: String!, $password: String!){
    addUser(username: $username, password: $password){
        token
        user {
          _id
        }
    }
  }
`;
export const ADD_REVIEW = gql`
  mutation addReview($reviewData: ReviewInput!) {
    addReview(reviewData: $reviewData) {
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

export const REMOVE_REVIEW = gql`
  mutation removeReview($reviewId: ID!) {
    removeReview(reviewId: $reviewId) {
      _id
    }
  }
`;

export const CREATE_WATCHLIST = gql`
  mutation createWatchlist($watchlistData: WatchlistInput!) {
    createWatchlist(watchlistData: $watchlistData) {
      _id
      title
      movies {
        movie_id
        added_date
        watched
      }
    }
  }
`;

export const UPDATE_MOVIE_WATCHED_STATUS = gql`
  mutation updateMovieWatchedStatus($watchlistId: ID!, $movieId: String!, $watched: Boolean!) {
    updateMovieWatchedStatus(watchlistId: $watchlistId, movieId: $movieId, watched: $watched) {
      _id
      movies {
        movie_id
        watched
      }
    }
  }
`;