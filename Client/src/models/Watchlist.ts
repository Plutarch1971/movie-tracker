export interface Watchlist {
    user_id: string | null;
    title: string | null ;
    movies: {
        movie_id: string | null;
        added_date: Date | null;
        watched: boolean | null;
    }[];
}