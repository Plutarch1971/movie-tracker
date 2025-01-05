export interface Review {
    user_id: string | null;
    movie_id: string | null;
    date: Date | null;
    rating: number | null;
    note: string | null;
}