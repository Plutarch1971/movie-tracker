export interface movie {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
    release_date: string;
    genre: string;
    cast: [
        id:number,
        name: string,
        character: string,
    ];
}