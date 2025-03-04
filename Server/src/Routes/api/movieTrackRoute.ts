import {Router, type Request, type Response} from 'express';
import { MovieTrackService } from '../../Service/movieTrackService.js';
import { autheticateToken } from '../../middleware/apiTokenAuth.js';


const APIrouter = Router();
const movieService = new MovieTrackService();

//search movies
APIrouter.get('/search', autheticateToken, async (req: Request, res: Response) => {
    try{
        const query = req.query.q as string;
        if(!query){
            res.status(400).send('search query is required');
            return;
        }

        const movies = await movieService.searchMovies(query);
        res.json(movies);
    }catch(error){
        res.status(500).send({erro: 'Failed to search movies'});
    }
});

//get movie details
APIrouter.get('/:movieId', autheticateToken, async (req: Request, res: Response) => {
    try{
        const movieId = parseInt(req.params.movieId);
        if (isNaN(movieId)){
            res.status(400).send({erro: 'Invalid movie id'});
            return;
        }

        const movie = await movieService.getMovieDetails(movieId);
        res.json(movie);
    }catch(error){
        res.status(500).send({erro: 'Failed to get movie details'});
    }
});


export default APIrouter;
