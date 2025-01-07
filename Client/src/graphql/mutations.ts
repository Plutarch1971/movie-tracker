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