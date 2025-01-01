import type { Watchlist } from './Watchlist';

export interface User {
    username: string | null;
    password: string | null;
    watchlist: Watchlist [];
}