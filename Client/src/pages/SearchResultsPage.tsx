import dummyMovies from "../data/dummyMovies.json";
import { useState } from "react";

function SearchResultsPage() {

    // const dummyMoviesData = dummyMovies
    const [dummyMoviesData, setDummyMoviesData] = useState(dummyMovies);


    function filterSearch(event: any) {
        const input = event.target.value;

        const filteredMoviesData = dummyMovies.filter(movie => movie.original_title.toLowerCase().includes(input.toLowerCase()));

        setDummyMoviesData(filteredMoviesData)
    
    }

    return (
        <>
           
            <div className="search-container">
            <div><h1>Search Results Page</h1></div>
                <label htmlFor="search-input">Search</label>
                <input id="search-input" type="search" onChange={filterSearch}/>
            </div>
            <div className="search-results-container">
                {
                    dummyMoviesData.map(movie => {
                        return (
                            <div className="movie-search-item">
                                <img src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`} />
                                <h4>{movie.original_title}</h4>
                            </div>
                        )

                    })
                }
            </div>
        </>
    )
}

export default SearchResultsPage;