import gql from 'graphql-tag';

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
    rating: Float  # Changed from Int! to Float since it's optional in the schema
    user: User
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
    rating: Float!  # Changed from Int to Float to match the schema
  }

  input WatchlistInput {
    title: String!
  }

  input WatchlistMovieInput {
    movie_id: String!
    watched: Boolean
  }
   type Auth { 
   token: ID!
   user: User!
   }

    type TopRatedMovie {
    movie_id: String!
    averageRating: Float!
    numberOfReviews: Int!
  }



  type Query {
    me: User
    getUserReviews(userId: ID!): [Review!]!
    getUserWatchlists(userId: ID!): [Watchlist!]!
    getMovieReviews(movieId: String!): [Review!]!
    getMovieRating(movieId: String!): MovieRating!
    getTopRatedMovies(limit: Int!): [TopRatedMovie!]!
    getRecentReviews(limit: Int!): [Review!]!
    getMostReviewedMovies(limit: Int!): [TopRatedMovie!]!
  }

  type Mutation {
    login(username:String!, password: String!): Auth!
    addReview(reviewData: ReviewInput!): Review!
    removeReview(reviewId: ID!): Boolean!
    updateReviewRating(reviewId: ID!, rating: Float!): Review!
    addUser(username: String!, password: String!): Auth!
    createWatchlist(watchlistData: WatchlistInput!): Watchlist!
    deleteWatchlist(watchlistId: ID!): Boolean!
    addMovieToWatchlist(watchlistId: ID!, movieData: WatchlistMovieInput!): Watchlist!
    removeMovieFromWatchlist(watchlistId: ID!, movieId: String!): Watchlist!
    updateMovieWatchedStatus(watchlistId: ID!, movieId: String!, watched: Boolean!): Watchlist!
  }
`;