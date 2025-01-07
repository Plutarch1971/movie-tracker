import { useState } from 'react';
import { useMutation, gql, useQuery } from '@apollo/client';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import '../../index.css';
import { GET_ME } from '../../graphql/queries';

const ADD_TO_WATCHLIST = gql`
  mutation AddMovieToWatchlist($watchlistId: ID!, $movieData: WatchlistMovieInput!) {
    addMovieToWatchlist(watchlistId: $watchlistId, movieData: $movieData) {
      _id
      title
      movies {
        movie_id
        watched
        added_date
      }
    }
  }
`;

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    movie: {
        id: number;
        title: string;
        posterURL: string;
    };
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, movie }) => {
    const [error, setError] = useState<string>('');
    const [selectedWatchlistId, setSelectedWatchlistId] = useState<string>('');
    
    // Get user's watchlists
    const { data: userData } = useQuery(GET_ME);
    
    const [addToWatchlist, { loading }] = useMutation(ADD_TO_WATCHLIST, {
      onCompleted: () => {
        onClose();
      },
      onError: (error) => {
        setError(error.message);
      },
      refetchQueries: [{ query: GET_ME }]
    });
  
    const handleAdd = async () => {
      if (!selectedWatchlistId) {
        setError('Please select a watchlist');
        return;
      }

      try {
        await addToWatchlist({
          variables: { 
            watchlistId: selectedWatchlistId,
            movieData: {
              movie_id: movie.id.toString(),
              watched: false
            }
          },
        });
      } catch (err) {
        setError('Failed to add movie to watchlist');
      }
    };

    return (
      <Modal show={isOpen} onHide={onClose}>
        <Modal.Dialog>
         <Modal.Body>
            <Modal.Header>
              <Modal.Title>Add to Watchlist</Modal.Title>
            </Modal.Header>
            <div className='p-4'>
                <p className='mb-4'>Add "{movie.title}" to your watchlist?</p>
                
                {userData?.me?.watchlists?.length > 0 ? (
                  <select
                    className="form-select mb-4"
                    value={selectedWatchlistId}
                    onChange={(e) => setSelectedWatchlistId(e.target.value)}
                  >
                    <option value="">Select a watchlist</option>
                    {userData.me.watchlists.map((watchlist: any) => (
                      <option key={watchlist._id} value={watchlist._id}>
                        {watchlist.title}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Alert variant="info" className="mb-4">
                    You don't have any watchlists yet. Create one first!
                  </Alert>
                )}

                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button 
                      onClick={handleAdd} 
                      disabled={loading || !selectedWatchlistId}
                    >
                        {loading ? 'Adding...' : 'Add to Watchlist'}
                    </Button>
                </div>
            </div>
         </Modal.Body>
        </Modal.Dialog>
      </Modal>
    );
};
