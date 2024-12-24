export interface WatchlistItem {
    userId: string | null;
    title: string | null;
    type: string | null; // Movie or TV Show
    status: string | null; // Want to watch, Watching, Watched
    genre: string | null;
    mongodbUrl: string | null;
}