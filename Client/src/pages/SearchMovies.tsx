import { useState } from 'react';
import { Container, Row, Col, Form, Card } from 'react-bootstrap';

const MovieSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample movie data - replace with actual API data
  const sampleMovies = [
    { id: 1, title: "Inception", rating: "8.8/10", length: "2h 28min", poster: "poster-url-1" },
    { id: 2, title: "The Dark Knight", rating: "9.0/10", length: "2h 32min", poster: "poster-url-2" },
    { id: 3, title: "Interstellar", rating: "8.6/10", length: "2h 49min", poster: "poster-url-3" },
    { id: 4, title: "Pulp Fiction", rating: "8.9/10", length: "2h 34min", poster: "poster-url-4" },
    { id: 5, title: "The Matrix", rating: "8.7/10", length: "2h 16min", poster: "poster-url-5" },
    { id: 6, title: "Forrest Gump", rating: "8.8/10", length: "2h 22min", poster: "poster-url-6" },
  ];

  return (
    <div className="bg-dark min-vh-100 py-4">
      <Container>
        {/* Header Section */}
        <Row className="mb-4">
          <Col>
            <h1 className="text-white mb-4">Search</h1>
            <Form.Control
              type="search"
              placeholder="Search for movies..."
              className="form-control-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col>
          <Col xs="auto" className="text-end">
            <a href="/profile" className="text-light text-decoration-none">
              Signup/Login or MyProfile
            </a>
          </Col>
        </Row>

        {/* Movie Grid */}
        <Row className="g-4">
          {sampleMovies.map((movie) => (
            <Col key={movie.id} xs={12} sm={6} md={4} lg={2}>
              <Card className="h-100 bg-light">
                <Card.Body className="p-0">
                  <div className="position-relative">
                    {/* Placeholder for movie poster */}
                    <div 
                      className="bg-secondary ratio ratio-1x1 mb-2"
                      style={{ minHeight: '200px' }}
                    >
                      <div className="d-flex align-items-center justify-content-center">
                        <span>Poster</span>
                      </div>
                    </div>
                    {/* Movie info overlay */}
                    <div className="p-2">
                      <h6 className="mb-1">{movie.title}</h6>
                      <small className="text-muted">
                        {movie.length} | Rating: {movie.rating}
                      </small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default MovieSearchPage;