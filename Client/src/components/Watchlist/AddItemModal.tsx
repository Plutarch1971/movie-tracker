import { useState } from 'react';
import { useMutation, gql, useQuery } from '@apollo/client';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import '../../index.css';
import { GET_ME } from '../../graphql/queries';
import { CREATE_WATCHLIST } from '../../graphql/mutations';



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
  const [newWatchlistTitle, setNewWatchlistTitle] = useState<string>('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  const { data: userData } = useQuery(GET_ME);
  
  const [addToWatchlist, { loading: addLoading }] = useMutation(ADD_TO_WATCHLIST, {
    onCompleted: () => {
      onClose();
    },
    onError: (error) => {
      setError(error.message);
    },
    refetchQueries: [{ query: GET_ME }]
  });

  const [createWatchlist] = useMutation(CREATE_WATCHLIST, {
    onCompleted: (data) => {
      // After creating watchlist, add the movie to it
      handleAddToWatchlist(data.createWatchlist._id);
    },
    onError: (error) => {
      setError(error.message);
    }
  });

  const handleAddToWatchlist = async (watchlistId: string) => {
    try {
      await addToWatchlist({
        variables: { 
          watchlistId,
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

  const handleAdd = async () => {
    if (isCreatingNew) {
      if (!newWatchlistTitle.trim()) {
        setError('Please enter a watchlist name');
        return;
      }
      try {
        await createWatchlist({
          variables: {
            watchlistData: {
              title: newWatchlistTitle
            }
          }
        });
      } catch (err) {
        setError('Failed to create watchlist');
      }
    } else {
      if (!selectedWatchlistId) {
        setError('Please select a watchlist');
        return;
      }
      await handleAddToWatchlist(selectedWatchlistId);
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
            
            <div className="mb-4">
              <Button 
                variant={isCreatingNew ? "primary" : "outline-primary"}
                onClick={() => setIsCreatingNew(true)}
                className="mr-2"
              >
                Create New Watchlist
              </Button>
              <Button 
                variant={!isCreatingNew ? "primary" : "outline-primary"}
                onClick={() => setIsCreatingNew(false)}
                disabled={!userData?.me?.watchlists?.length}
              >
                Add to Existing
              </Button>
            </div>

            {isCreatingNew ? (
              <input
                type="text"
                className="form-control mb-4"
                placeholder="Enter watchlist name"
                value={newWatchlistTitle}
                onChange={(e) => setNewWatchlistTitle(e.target.value)}
              />
            ) : (
              userData?.me?.watchlists?.length > 0 ? (
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
                  You don't have any watchlists yet. Create a new one!
                </Alert>
              )
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
                disabled={addLoading || (!isCreatingNew && !selectedWatchlistId)}
              >
                {addLoading ? 'Adding...' : 'Add to Watchlist'}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal.Dialog>
    </Modal>
  );
}