import React, { useState } from 'react';
import '/src/assets/styles/searchResults.css';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL;
  const API_Token = import.meta.env.VITE_API_TOKEN_SECRET;
  const RESULTS_PER_PAGE = 20; // TMDB API returns 20 results per page

  const searchMovies = async (query: string, page: number = 1) => {
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
        `${API_URL}/3/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}&include_adult=false`,
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
      setTotalPages(data.total_pages);
      setMovies(data.results || []);
      setCurrentPage(page);

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
    searchMovies(searchTerm, 1); // Reset to first page on new search
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      searchMovies(searchTerm, newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
    const navigate = useNavigate();
  
    const handleClick = () => {
      navigate(`/movie/${movie.id}`);
    };
  
    return (
      <div 
        className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer" 
        style={{ width: '250px' }}
        onClick={handleClick}
      >
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
  };

  const PaginationControls = () => {
    const startResult = (currentPage - 1) * RESULTS_PER_PAGE + 1;
    const endResult = Math.min(currentPage * RESULTS_PER_PAGE, totalResults);

    return (
      <div className="flex flex-col items-center space-y-4 mt-6 mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="px-4 py-2 bg-gray-100 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Previous
          </button>
          
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="px-4 py-2 bg-gray-100 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
        
        <div className="text-gray-600">
          Showing {startResult}-{endResult} of {totalResults} results
        </div>
      </div>
    );
  };

  return (
    <div className="search-results-page">
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
          <PaginationControls />
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