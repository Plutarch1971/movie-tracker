import React, { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';


interface Movie {
  id: number;
  original_title: string;
  poster_path: string;
}

const SearchResultsPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;
  const API_Token = import.meta.env.VITE_API_TOKEN_SECRET;

  const searchMovies = async (query: string) => {
    if (!query.trim()) {
      setMovies([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/movies/search?q=${query}`, {
        headers: {
          'Authorization': `Bearer ${API_Token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      setMovies(data);
    } catch (error) {
      setError('Error searching movies. Please try again.');
      console.error('Error searching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce the search function to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((query: string) => searchMovies(query), 300),
    []
  );

  // Handle search input changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setSearchTerm(input);
    debouncedSearch(input);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Results Page</h1>
      
      <div className="mb-6">
        {/* <div className="flex gap-2 items-center"> */}
        <div className="search-container">
          <label htmlFor="search-input" className="font-medium">Search</label>
          <input 
            id="search-input"
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Start typing to search movies..."
            className="border rounded p-2 flex-grow form-control placeholder-lg"
          />
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-4">
          Loading...
        </div>
      )}

      {error && (
        <div className="text-red-500 py-2">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <div key={movie.id} className="border rounded-lg overflow-hidden shadow-sm">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                alt={movie.original_title}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                No Image Available
              </div>
            )}
            <div className="p-4">
              <h4 className="font-medium text-lg">{movie.original_title}</h4>
            </div>
          </div>
        ))}
      </div>

      {!isLoading && !error && movies.length === 0 && searchTerm && (
        <div className="text-center py-4 text-gray-500">
          No movies found for "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;