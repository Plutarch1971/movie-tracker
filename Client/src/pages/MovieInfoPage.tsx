import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/UI/card';
import { Button } from '../components/UI/Button';
import { Heart, Loader2 } from 'lucide-react';

interface MovieInfos {
  id: number;
  original_title: string;
  actors: string[];
  genres: string[];
  runtime: number;
  vote_average: number;
  overview: string;
  poster_path: string;
}

interface MovieInfoPageProps {
  movieId: number;
  onClose?: () => void;
  apiUrl: string;
  apiToken: string;
}

const MovieInfoPage = ({ movieId, onClose, apiUrl, apiToken }: MovieInfoPageProps) => {
  const [movie, setMovie] = useState<MovieInfos | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchMovieInfos = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`${apiUrl}/movies/${movieId}`, {
          headers: {
            'Authorization': `Bearer ${apiToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch movie Infos');
        }

        const data = await response.json();
        setMovie(data);
        
        // Check if movie is already in saved list
        const savedMovies = JSON.parse(localStorage.getItem('savedMovies') || '[]');
        setIsSaved(savedMovies.some((savedMovie: MovieInfos) => savedMovie.id === data.id));
      } catch (error) {
        setError('Error loading movie Infos. Please try again.');
        console.error('Error fetching movie Infos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (movieId) {
      fetchMovieInfos();
    }
  }, [movieId, apiUrl, apiToken]);

  const handleSaveMovie = () => {
    if (!movie) return;

    const savedMovies = JSON.parse(localStorage.getItem('savedMovies') || '[]');
    
    if (isSaved) {
      // Remove movie from saved list
      const updatedMovies = savedMovies.filter(
        (savedMovie: MovieInfos) => savedMovie.id !== movie.id
      );
      localStorage.setItem('savedMovies', JSON.stringify(updatedMovies));
      setIsSaved(false);
    } else {
      // Add movie to saved list
      savedMovies.push(movie);
      localStorage.setItem('savedMovies', JSON.stringify(savedMovies));
      setIsSaved(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        {error}
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center p-4">
        Movie not found
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">{movie.original_title}</CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={handleSaveMovie}
                variant={isSaved ? "secondary" : "default"}
                className="flex items-center gap-2"
              >
                <Heart className={isSaved ? "fill-current" : ""} size={16} />
                {isSaved ? "Saved" : "Save to List"}
              </Button>
              {onClose && (
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.original_title}
                  className="w-full rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  No Image Available
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-semibold">Actors:</p>
                <p>{movie.actors.join(', ')}</p>
              </div>
              <div>
                <p className="font-semibold">Genre:</p>
                <p>{movie.genres.join(', ')}</p>
              </div>
              <div>
                <p className="font-semibold">Length:</p>
                <p>{movie.runtime} minutes</p>
              </div>
              <div>
                <p className="font-semibold">Rating:</p>
                <p>{movie.vote_average.toFixed(1)} / 10</p>
              </div>
              <div>
                <p className="font-semibold">Description:</p>
                <p className="text-gray-600">{movie.overview}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MovieInfoPage;