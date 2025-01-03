import type { User } from '../models/User';
import type { Movie } from '../models/Movie';
import type { Review } from '../models/Review';


export const getMe = (token: string) => {
    return fetch('/api/users/me', {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    });
  };
  
  export const createUser = (userData: User) => {
    return fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  };
  
  export const loginUser = (userData: User) => {
    return fetch('/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  };

  export const saveMovie = (movieData: Movie, token: string) => {
    return fetch('/api/users/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(movieData),
    });
  }

  export const deleteMovie = (movieId: string, token: string) => {
    return fetch(`/api/users/movies/${movieId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  }

  export const addReview = (reviewData: Review, token: string) => {
    return fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });
  };
  
  export const deleteReview = (reviewId: string, token: string) => {
    return fetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  };

  export const updateMovieWatchStatus = (movieId: string, watched: boolean, token: string) => {
    return fetch(`/api/users/movies/${movieId}/watched`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ watched }),
    });
  };
  
  export const getMovieDetails = async (movieId: string) => {
    const response = await fetch(`/api/movies/${movieId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }
    return response.json();
  };
  
