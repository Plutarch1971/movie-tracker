import {useQuery, gql} from '@apollo/client';
import { WatchlistItem } from './WatchlistItem';

const GET_WATCHLIST = gql`
    query GetWatchlist{
        watchlist{
            id
            title
            posterURL
            addedAt
        }
    }
`;

interface WatchlistMovie {
    id: number;
    title: string;
    posterURL: string;
    addedAt: string;
}

export const WatchlistGrid: React.FC = () => {
    const {data, loading, error} = useQuery(GET_WATCHLIST);

    if (loading) return <div className='p-4'>Loading watchlist...</div>;
    if (error) return <div className='p-4 text-red-500'>Error loading watchlist</div>;

    return (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">My Watchlist</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data?.watchlist.map((movie: WatchlistMovie) => (
              <WatchlistItem key={movie.id} movie={movie} />
            ))}
            {data?.watchlist.length === 0 && (
              <p className="col-span-full text-center text-gray-500">
                Your watchlist is empty
              </p>
            )}
          </div>
        </div>
      );
};