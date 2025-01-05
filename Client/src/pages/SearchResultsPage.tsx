import React, { useState } from 'react';
import '/src/assets/styles/searchResults.css';

interface Movie {
  id: number;
  original_title: string;
  poster_path: string | null;
}

interface SearchResponse {
  results: Movie[];
  total_results: number;
  page: number;
  total_pages: number;
}

const SearchResultsPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalResults, setTotalResults] = useState(0);

  const API_URL = 'https://api.themoviedb.org/3';
  const API_Token = import.meta.env.VITE_API_TOKEN_SECRET;
  const MAX_RESULTS = 30;

  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      setMovies([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      if (!API_Token) {
        throw new Error('API Token is missing');
      }

      const response = await fetch(
        `${API_URL}/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`,
        {
          headers: {
            'Authorization': `Bearer ${API_Token}`,
            'accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.status_message || `HTTP error! status: ${response.status}`
        );
      }

      const data: SearchResponse = await response.json();
      setTotalResults(data.total_results);
      // Limit the results to MAX_RESULTS
      setMovies(data.results.slice(0, MAX_RESULTS) || []);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error searching movies';
      setError(errorMessage);
      console.error('Error searching movies:', err);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchMovies(searchTerm);
  };

  const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200" style={{ width: '250px' }}>
      {movie.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
          alt={movie.original_title}
          className="w-full h-64 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/api/placeholder/185/278';
            target.alt = 'Image not available';
          }}
        />
      ) : (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
          No Image Available
        </div>
      )}
      <div className="p-4">
        <h4 className="font-medium text-lg line-clamp-2">{movie.original_title}</h4>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <form onSubmit={handleSubmit} className="search-bar">
        <div className="search-container">
          <label htmlFor="search-input">
            Search for movies
          </label>
          <input 
            id="search-input"
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Enter movie title and click Search"
            className="form-control placeholder-lg"
            disabled={isLoading}
            autoComplete="off"
            autoFocus
          />
          <button 
            type="submit" 
            disabled={isLoading || !searchTerm.trim()}
          >
            {isLoading ? 'Searching...' : 'Search Movies'}
          </button>
        </div>
      </form>

      <div className="search-results-container">
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
            <p className="mt-2 text-gray-600">Searching...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="search-Results">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {!isLoading && !error && movies.length > 0 && (
          <div className="text-center py-4 text-gray-600">
            Showing {movies.length} of {totalResults} results
          </div>
        )}

        {!isLoading && !error && movies.length === 0 && searchTerm && (
          <div className="text-center py-8 text-gray-500">
            No movies found for "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;