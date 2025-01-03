import dotenv from 'dotenv';
import axios from 'axios';//Axios is a promise based HTTP client for the browser and node.js it functions as javas fetch function.
dotenv.config();

class Movie{
    constructor(
        public name: string, 
        public actors:string[], 
        public length: number, 
        public genre: string[], 
        public rating: number, 
        public year: number, 
        public summary: string) {}
}

interface MovieDetails {
    title: string,
    runtime: number,
    release_date: string,
    overview: string,
    genres: Array<{id:number; name: string}>,
}

interface CastResonse {
    cast: Array<{name: string}>
}

class MovieTrackService{
    private readonly apiKey: string;
    private readonly baseUrl: string = 'https://api.themoviedb.org/3';


    constructor(){
        this.apiKey = process.env.TMBD_API_KEY || '';
     //   if(this.apiKey === ''){
    //        throw new Error('TMBD API key not found');
     //   }
    }


    async searchMovies(query: string): Promise<Movie[]> {
        try{
           const response = await axios.get(`${this.baseUrl}/search/movie`, {
                params: {
                    api_key: this.apiKey,
                   query: query
                }
            });

            const movies = await Promise.all(
                response.data.results.slice(0,5).map(async (movie: any) => {
                    return await this.getMovieDetails(movie.id);
                })
            );

            return movies;
        }catch (error){
            throw new Error(`Failed to search movies`);
        }
    }

    async getMovieDetails(movieId: number): Promise<Movie> {
        try{
            //get movie details
            const movieDetails = await axios.get<MovieDetails>(
                `${this.baseUrl}/movie/${movieId}`, 
                {
                    params: {
                        api_key: this.apiKey
                    }
                }
            );

            //get cast details
            const castDetails = await axios.get<CastResonse>(
                `${this.baseUrl}/movie/${movieId}/credits`, 
                {
                    params: {
                        api_key: this.apiKey
                    }
                }
            );

            const movieData = movieDetails
            const castData = castDetails

            const year = new Date(movieData.data.release_date).getFullYear();

            return new Movie(
                movieData.data.title,
                castData.data.cast.map(cast => cast.name),
                movieData.data.runtime,
                movieData.data.genres.map(genre => genre.name),
                0,
                year,
                movieData.data.overview
            );
        }catch (error){
            throw new Error(`Failed to get movie details`);
        }
    }
}

export { MovieTrackService, Movie };