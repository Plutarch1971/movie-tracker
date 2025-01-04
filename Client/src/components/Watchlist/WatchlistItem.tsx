import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import Card from 'react-bootstrap/Card'; // This is a CSS for the card
import Button  from 'react-bootstrap/Button'; // This is a CSS for the button
import { Trash } from 'lucide-react';


const REMOVE_FROM_WATCHLIST = gql`
    mutation RemoveFromWatchList($movieId: ID!){
        removeFromWatchList(movieId: $movieId){
        id
        }
    }
`;


interface WatchlistItemProps {
    movie: {
        id: number;
        title: string;
        posterURL: string;
        addedAt: string;
    };
}


export const WatchlistItem: React.FC<WatchlistItemProps> = ({ movie }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [removeFromWatchlist] = useMutation(REMOVE_FROM_WATCHLIST, {
      update(cache) {
        cache.modify({
          fields: {
            watchlist(existingMovies = [], { readField }) {
              return existingMovies.filter(
                (movieRef: any) => readField('id', movieRef) !== movie.id
              );
            },
          },
        });
      },
    });
  
    const handleRemove = async () => {
      try {
        await removeFromWatchlist({
          variables: { movieId: movie.id },
        });
      } catch (err) {
        console.error('Failed to remove movie:', err);
      }
    };
  
    return (
      <Card
        className="relative overflow-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card.Body className="p-0">
          <Link to={`/movie/${movie.id}`}>
            <img
              src={movie.posterURL}
              alt={movie.title}
              className="w-full h-64 object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200" />
          </Link>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
            <h3 className="text-white font-semibold truncate">{movie.title}</h3>
            <p className="text-gray-300 text-sm">
              Added {new Date(movie.addedAt).toLocaleDateString()}
            </p>
          </div>
          {isHovered && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </Card.Body>
      </Card>
    );
  };