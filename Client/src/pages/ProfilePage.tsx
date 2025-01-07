import { useState, useEffect } from "react";
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../graphql/queries';
import { REMOVE_REVIEW, UPDATE_MOVIE_WATCHED_STATUS } from '../graphql/mutations';
import { StarIcon } from "lucide-react";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'reviews'>('watchlist');
  const [movieDetails, setMovieDetails] = useState<Record<string, any>>({});

  const { loading, error, data } = useQuery(GET_ME);
  const [removeReview] = useMutation(REMOVE_REVIEW, {
    refetchQueries: [{ query: GET_ME }]
  });
  const [updateWatchedStatus] = useMutation(UPDATE_MOVIE_WATCHED_STATUS, {
    refetchQueries: [{ query: GET_ME }]
  });

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const movieIds = data?.me?.reviews?.map((r: any) => r.movie_id) || [];
      const watchlistMovieIds = data?.me?.watchlists?.flatMap((w: any) => 
        w.movies.map((m: any) => m.movie_id)
      ) || [];
      
      const allMovieIds = [...new Set([...movieIds, ...watchlistMovieIds])];
      
      const details: Record<string, any> = {};
      await Promise.all(
        allMovieIds.map(async (movieId) => {
          try {
            const response = await fetch(
              `https://api.themoviedb.org/3/movie/${movieId}`,
              {
                headers: {
                  'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN_SECRET}`,
                  'accept': 'application/json'
                }
              }
            );
            const data = await response.json();
            details[movieId] = data;
          } catch (err) {
            console.error(`Error fetching details for movie ${movieId}:`, err);
          }
        })
      );
      setMovieDetails(details);
    };

    if (data?.me) {
      fetchMovieDetails();
    }
  }, [data]);

  const handleRemoveReview = async (reviewId: string) => {
    try {
      await removeReview({
        variables: { reviewId }
      });
    } catch (err) {
      console.error('Error removing review:', err);
    }
  };

  const handleUpdateWatchStatus = async (watchlistId: string, movieId: string, watched: boolean) => {
    try {
      await updateWatchedStatus({
        variables: { watchlistId, movieId, watched }
      });
    } catch (err) {
      console.error('Error updating watch status:', err);
    }
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error.message}</div>;
  if (!data?.me) return <div className="text-center p-4">Please log in to view your profile.</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {data.me.username}!</h1>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`${
                activeTab === 'watchlist'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
              onClick={() => setActiveTab('watchlist')}
            >
              Watchlist
            </button>
            <button
              className={`${
                activeTab === 'reviews'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'watchlist' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.me.watchlists.map((watchlist: any) => (
            <div key={watchlist._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-4">{watchlist.title}</h3>
                <div className="space-y-4">
                  {watchlist.movies.map((movie: any) => {
                    const movieDetail = movieDetails[movie.movie_id];
                    return (
                      <div key={movie.movie_id} className="flex items-center space-x-4">
                        {movieDetail && (
                          <img
                            src={`https://image.tmdb.org/t/p/w200${movieDetail.poster_path}`}
                            alt={movieDetail.title}
                            className="w-16 h-24 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{movieDetail?.title}</p>
                          <div className="flex items-center mt-2">
                            <input
                              type="checkbox"
                              checked={movie.watched}
                              onChange={(e) => handleUpdateWatchStatus(watchlist._id, movie.movie_id, e.target.checked)}
                              className="form-checkbox h-4 w-4 text-indigo-600"
                            />
                            <span className="ml-2 text-sm text-gray-600">Watched</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.me.reviews.map((review: any) => {
            const movieDetail = movieDetails[review.movie_id];
            return (
              <div key={review._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {movieDetail && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`}
                    alt={movieDetail.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{movieDetail?.title}</h3>
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-5 h-5 ${
                          star <= review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">{review.note}</p>
                  <button
                    onClick={() => handleRemoveReview(review._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove Review
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;