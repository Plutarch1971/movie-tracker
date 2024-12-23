import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { User } from '../types/User';

// GraphQL queries and mutations
const GET_USER_PROFILE = gql`
  query GetUserProfile {
    me {
      username
      email
      watchList {
        id
        title
        poster
      }
      reviews {
        id
        movieId
        title
        content
        rating
      }
    }
  }
`;

interface MovieItem {
  id: string;
  title: string;
  poster: string;
}

interface Review {
  id: string;
  movieId: string;
  title: string;
  content: string;
  rating: number;
}

interface UserProfile {
  me: {
    username: string;
    email: string;
    watchList: MovieItem[];
    reviews: Review[];
  }
}

const UserProfilePage = () => {
  // Fetch user profile data
  const { loading, error, data } = useQuery<UserProfile>(GET_USER_PROFILE);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;
  if (!data) return <div>No profile data found</div>;

  const { username, watchList, reviews } = data.me;

  return (
    <div className="bg-dark min-vh-100 text-white py-4">
      <Container>
        {/* Header Section */}
        <Row className="mb-4 justify-content-between align-items-center">
          <Col>
            <h1>Profile</h1>
          </Col>
          <Col xs="auto">
            <Link to="/search" className="text-light text-decoration-none">
              Search
            </Link>
          </Col>
        </Row>

        {/* User Welcome Section */}
        <Card className="bg-light text-dark mb-4">
          <Card.Body>
            <h2>Hello {username}!</h2>
          </Card.Body>
        </Card>

        {/* Watch List Section */}
        <section className="mb-5">
          <h2 className="mb-4">Watch List - Movies the user wants to watch</h2>
          <Row className="g-4">
            {watchList.map((movie) => (
              <Col key={movie.id} xs={12} sm={6} md={4} lg={3}>
                <Card className="bg-primary h-100">
                  <Card.Body>
                    <div className="ratio ratio-1x1 mb-2">
                      {movie.poster ? (
                        <img 
                          src={movie.poster} 
                          alt={movie.title} 
                          className="object-fit-cover"
                        />
                      ) : (
                        <div className="bg-secondary d-flex align-items-center justify-content-center">
                          <span>No Poster</span>
                        </div>
                      )}
                    </div>
                    <h5 className="text-white">{movie.title}</h5>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Reviews Section */}
        <section>
          <h2 className="mb-4">Reviews</h2>
          <Row className="g-4">
            {reviews.map((review) => (
              <Col key={review.id} xs={12} md={6} lg={4}>
                <Card className="bg-primary h-100">
                  <Card.Body>
                    <h5 className="text-white">{review.title}</h5>
                    <p className="text-white-50">Rating: {review.rating}/5</p>
                    <p className="text-white">{review.content}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </Container>
    </div>
  );
};

export default UserProfilePage;