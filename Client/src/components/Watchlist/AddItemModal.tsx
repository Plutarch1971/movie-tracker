import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import '../../index.css'; // This CSS file contains the styling for the entire page and the above components used for CSS will be used in this file.


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
    const [addToWatchlist, { loading }] = useMutation(ADD_TO_WATCHLIST, {
      onCompleted: () => {
        onClose();
      },
      onError: (error) => {
        setError(error.message);
      },
    });
  
    const handleAdd = async () => {
      try {
        await addToWatchlist({
          variables: { movieId: movie.id },
        });
      } catch (err) {
        setError('Failed to add movie to watchlist');
      }
    };

    return (
      <Modal show={isOpen} onHide={onClose}>
        <Modal.Dialog >
         <Modal.Body>
            <Modal.Header>
            <Modal.Title>Add to Watchlist</Modal.Title>
            </Modal.Header>
            <div className= 'p-4'>
                <p className= 'mb-4'>Add "{movie.title} to your watchlist?"</p>
                {error && (
                <Alert variant="danger"className="mb-4">
                    {error}
                </Alert>
                )}
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleAdd} disabled={loading}>
                        {loading ? 'Adding...' : 'Added to Watchlist'}
                    </Button>
               </div>
            </div>
         </Modal.Body>
        </Modal.Dialog>
        </Modal>
    );
};
