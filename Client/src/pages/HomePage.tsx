import dummyMovies from "../data/dummyMovies.json";
import { useState, useEffect } from 'react';
import axios from 'axios';


function HomePage() {

    const [ dummyMoviesData, setDummyMoviesData] =useState(dummyMovies);
    const [trendingMovie, setTrendingMovie] = useState(null);

    useEffect(() => {
        async function fetchTrendingMovie(){
            try {
                const response = await axios.get('https://api.themoviedb.org/3/trending/movie/day', {
                    params: {
                        api_key: import.meta.env.VITE_TMDB_API_KEY  //Replace with your TMDB key
                    }
                });
              setTrendingMovie(response.data.results[0]);
            } catch (error) {
                console.error('Eror fetching trending movies:', error);
            }
        }
        fetchTrendingMovie();
    }, []);

    function filterSearch(event: any){
        const filteredMoviesData = dummyMovies.filter(movie => movie.original_title);
        setDummyMoviesData(filteredMoviesData);
    }
    return (
        <> 
        <div className="page-background">
            <div className="homepage-container">
                <h1 className="homepage-header">Movie Tracker</h1>
                <div className="row-container">
                    {trendingMovie && (
                    <img src={`https://image.tmdb.org/t/p/w500${trendingMovie.poster_path}`} alt={trendingMovie.title}/>
                    )}
                    <p>Favourite, review or log all of what you want to watch with ease! Join our growing community today!</p>
                
                </div>
            </div>
            <div className="movie-box-container">
              {
                dummyMoviesData.map(movie => {
                    return (
                        <div className="movie-item-container" key={movie.id}>
                            <img src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`} style={{ margin: '10px'}}/>
                        </div>
                    )
                })
              }
                
            </div>
         </div>        
        </>
    )
}

export default HomePage;