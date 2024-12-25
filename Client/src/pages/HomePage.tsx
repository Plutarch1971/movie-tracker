function HomePage() {
    return (
        <> 
        <div className="page-background">
            <div className="homepage-container">
                <h1 className="homepage-header">Movie Tracker</h1>
                <div className="row-container">
                    <img src="https://placehold.co/400" />
                    <p>Favourite, review or log all of what you want to watch with ease! Join our growing community today!</p>
                </div>
            </div>

            <div className="movie-box-container">
            <img src="https://placehold.co/10" />
            <img src="https://placehold.co/10" />
            <img src="https://placehold.co/10" />
            <img src="https://placehold.co/10" />
            <img src="https://placehold.co/10" />
            <img src="https://placehold.co/10" />
            <img src="https://placehold.co/10" />
                {/* <div className="movie-box">Movie 1</div>
                <div className="movie-box">Movie 2</div>
                <div className="movie-box">Movie 3</div>
                <div className="movie-box">Movie 4</div>
                <div className="movie-box">Movie 5</div>
                <div className="movie-box">Movie 6</div>
                <div className="movie-box">Movie 7</div> */}
            </div>
        </div>
        </>
    )
}

export default HomePage;