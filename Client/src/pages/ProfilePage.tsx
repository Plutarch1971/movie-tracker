import { useState, useEffect } from "react";
import auth from "../utils/auth";
import type { User } from "../models/User";


const ProfilePage = () => {
  const [userData, setUserData] = useState<User>({
    username: '',
    password: '',
    watchlist: [],
    reviews: []
  });
  const [activeTab, setActiveTab] = useState<'watchlist' | 'reviews'>('watchlist');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = auth.loggedIn() ? auth.getToken() : null;

        if (!token) {
          setError("Please log in to view your profile");
          setLoading(false);
          return;
        }

        const response = await fetch('/api/users/me', {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const user = await response.json();
        setUserData(user);
        setLoading(false);
      } catch (error) {
        setError('Error fetching user data');
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  const handleRemoveFromWatchlist = async (movieId: string) => {
    try {
      const token = auth.getToken();
      const response = await fetch(`/api/users/movies/${movieId}`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove movie');
      }

      // Update local state to remove the movie
      setUserData(prev => ({
        ...prev,
        watchlist: prev.watchlist.filter(item => 
          item.movies.every(movie => movie.movie_id !== movieId)
        )
      }));
    } catch (error) {
      setError('Failed to remove movie from watchlist');
    }
  };

  const handleUpdateWatchStatus = async (movieId: string, watched: boolean) => {
    try {
      const token = auth.getToken();
      const response = await fetch(`/api/users/movies/${movieId}/watched`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ watched }),
      });

      if (!response.ok) {
        throw new Error('Failed to update watch status');
      }

      // Update local state
      setUserData(prev => ({
        ...prev,
        watchlist: prev.watchlist.map(list => ({
          ...list,
          movies: list.movies.map(movie => 
            movie.movie_id === movieId ? { ...movie, watched } : movie
          )
        }))
      }));
    } catch (error) {
      setError('Failed to update watch status');
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

    if (error) {
        return <div className="text-center text-danger p-4">{error}</div>;
    }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-body">
              <h1 className="card-title">Welcome, {userData.username}!</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'watchlist' ? 'active' : ''}`}
                onClick={() => setActiveTab('watchlist')}
              >
                Watchlist
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </button>
            </li>
          </ul>
        </div>
      </div>

      {activeTab === 'watchlist' && (
        <div className="row">
          {userData.watchlist.map((list) => (
            list.movies.map((movie, index) => (
              <div key={`${movie.movie_id}-${index}`} className="col-md-4 mb-4">
                <div className="card h-100">
                  <img 
                    src={`https://image.tmdb.org/t/p/w500/${movie.movie_id}`}
                    className="card-img-top"
                    alt="Movie poster"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/200x300?text=No+Image';
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{movie.movie_id}</h5>
                    <p className="card-text">
                      Added: {new Date(movie.added_date!).toLocaleDateString()}
                    </p>
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={movie.watched || false}
                        onChange={(e) => handleUpdateWatchStatus(movie.movie_id!, e.target.checked)}
                        id={`watched-${movie.movie_id}`}
                      />
                      <label className="form-check-label" htmlFor={`watched-${movie.movie_id}`}>
                        Watched
                      </label>
                    </div>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveFromWatchlist(movie.movie_id!)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          ))}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="row">
          {userData.reviews.map((review, index) => (
            <div key={index} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Movie ID: {review.movie_id}</h5>
                  <p className="card-text">{review.note}</p>
                  <div className="mb-2">
                    Rating: {Array(review.rating || 0).fill('★').join('')}
                    {Array(5 - (review.rating || 0)).fill('☆').join('')}
                  </div>
                  <small className="text-muted">
                    Reviewed on: {new Date(review.date!).toLocaleDateString()}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;