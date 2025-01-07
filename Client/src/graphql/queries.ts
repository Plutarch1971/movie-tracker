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
    query getReviews {
    reviews {
    _id
      movie_id
      date
      note
      rating
    }

    }
`;