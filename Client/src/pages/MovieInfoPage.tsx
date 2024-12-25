function MovieInfoPage () {
    return (
        <>
         <div className="movie-header">
            <h1>Movie Info Page</h1>   
         </div>
         <div className="movie-container">
            <div className="movie-item">Move Poster</div>
            <div className="movie-item">
                <p>Title:</p>
                <p>Actors:</p>
                <p>Genre:</p>
                <p>Length:</p>
                <p>Rating:</p>
                <p>Description:</p>
            </div>
        </div>

        </>
    );
}
//Add Save movie button
//Add option to rate the movie by user under movie details//give user 5 stars to click then hit button
//Add Reviews sectoin on the bottom

export default MovieInfoPage;