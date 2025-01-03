import { gql } from '@apollo/server';

export const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    watchlists: [Watchlist!]!
    reviews: [Review!]!
  }

  type Review {
    _id: ID!
    user_id: ID!
    movie_id: String!
    date: String!
    note: String!
    rating: Int!
    user: User!
  }

  type Watchlist {
    _id: ID!
    user_id: ID!
    title: String!
    movies: [WatchlistMovie!]!
    user: User!
  }

  type WatchlistMovie {
    movie_id: String!
    added_date: String!
    watched: Boolean!
  }

  type MovieRating {
    averageRating: Float!
    numberOfReviews: Int!
  }

  input ReviewInput {
    movie_id: String!
    note: String!
    rating: Int!
  }

  input WatchlistInput {
    title: String!
  }

  input WatchlistMovieInput {
    movie_id: String!
    watched: Boolean
  }

  type Query {
    me: User
    getUserReviews(userId: ID!): [Review!]!
    getUserWatchlists(userId: ID!): [Watchlist!]!
    getMovieReviews(movieId: String!): [Review!]!
    getMovieRating(movieId: String!): MovieRating!
  }

  type Mutation {
    addReview(reviewData: ReviewInput!): Review!
    removeReview(reviewId: ID!): Boolean!
    updateReviewRating(reviewId: ID!, rating: Int!): Review!
    
    createWatchlist(watchlistData: WatchlistInput!): Watchlist!
    deleteWatchlist(watchlistId: ID!): Boolean!
    addMovieToWatchlist(watchlistId: ID!, movieData: WatchlistMovieInput!): Watchlist!
    removeMovieFromWatchlist(watchlistId: ID!, movieId: String!): Watchlist!
    updateMovieWatchedStatus(watchlistId: ID!, movieId: String!, watched: Boolean!): Watchlist!
  }
`;