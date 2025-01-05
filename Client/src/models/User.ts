import type { Watchlist } from './Watchlist';
import type { Review } from './Review';

export interface User {
    username: string | null;
    password: string | null;
    watchlist: Watchlist [];
    reviews: Review [];
}